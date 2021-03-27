import * as path from 'path';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as cdk from '@aws-cdk/core';

/**
 * Properties for TidyUp construct
 */
export interface TidyUpProps {
  /**
   * your custom function to process the garbage collection
   *
   * @default - a default function will be created
   */
  readonly function?: lambda.IFunction;
  /**
   * The schedule to trigger the state machine
   * @default - every 4 hours
   */
  readonly schedule?: events.Schedule;
  /**
   * The ECR public repositories to check
   */
  readonly repository: string[];
}

/**
 * The primary consruct to tidy up ECR public images
 */
export class TidyUp extends cdk.Construct {
  readonly repository: string[];
  constructor(scope: cdk.Construct, id: string, props: TidyUpProps) {
    super(scope, id);

    this.repository = props.repository;

    const start = new sfn.Pass(this, 'prepare repos', {
      result: sfn.Result.fromObject({
        inputForMap: props.repository,
      }),
    });

    const map = new sfn.Map(this, 'Map State', {
      maxConcurrency: props.repository.length,
      itemsPath: sfn.JsonPath.stringAt('$.inputForMap'),
      outputPath: sfn.JsonPath.stringAt('$'),
    });

    map.iterator(new tasks.LambdaInvoke(this, 'LambdaInvoke', {
      lambdaFunction: props.function ?? this._addHandler().function,
      payload: sfn.TaskInput.fromObject({
        REPO: sfn.JsonPath.stringAt('$'),
      }),
    }));

    const definition = sfn.Chain.start(start)
      .next(map);

    const machine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    // schedule it with event bridge
    new events.Rule(this, 'ScheduleRule', {
      schedule: props.schedule ?? events.Schedule.cron({ hour: '*/4', minute: '0' }),
      targets: [new targets.SfnStateMachine(machine)],
    });
  }
  private _addHandler(): Handler {
    return new Handler(this, 'TidyUpHandler', {
      repository: this.repository,
    });
  }
}

/**
 * properties for the Handler
 */
export interface HandlerProps {
  readonly repository: string[];
}

/**
 * The default handler
 */
export class Handler extends cdk.Construct {
  readonly function: lambda.IFunction;
  constructor(scope: cdk.Construct, id: string, props: HandlerProps) {
    super(scope, id);

    const stack = cdk.Stack.of(this);

    const fn = new NodejsFunction(this, 'Function', {
      entry: path.join(__dirname, '../lambda/main.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(60),
    });
    this.function = fn;
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ecr-public:DescribeImages'],
      resources: ['*'],
    }));

    props.repository.forEach(r => {
      fn.addToRolePolicy(new iam.PolicyStatement({
        actions: ['ecr-public:BatchDeleteImage'],
        resources: [stack.formatArn({
          service: 'ecr-public',
          region: '',
          resource: 'repository',
          resourceName: r,
        })],
      }));
    });
  }
}
