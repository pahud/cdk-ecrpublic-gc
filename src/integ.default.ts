import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { TidyUp } from './';


export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {

    const devEnv = {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    };

    const app = new cdk.App();

    const stack = new cdk.Stack(app, 'ecr-public-gc', { env: devEnv });
    this.stack = [stack];

    new TidyUp(stack, 'TidyUp', {
      repository: [
        'vscode',
        'gitpod-workspace',
        'github-codespace',
      ],
      schedule: events.Schedule.cron({ hour: '*/4', minute: '0' }),
    });

    app.synth();
  }
}

new IntegTesting();
