[![NPM version](https://badge.fury.io/js/cdk-ecrpublic-gc.svg)](https://badge.fury.io/js/cdk-ecrpublic-gc)
[![PyPI version](https://badge.fury.io/py/cdk-ecrpublic-gc.svg)](https://badge.fury.io/py/cdk-ecrpublic-gc)
![Release](https://github.com/pahud/cdk-ecrpublic-gc/workflows/Release/badge.svg)

# cdk-ecrpublic-gc

CDK construct library that helps you build a garbage collector to delete all untagged images in Amazon ECR public with AWS CDK.

# Why

Amazon ECR public does not have lifecycle policy to clean up all untagged images at this moment(see [this issue](https://github.com/aws/containers-roadmap/issues/1268)). `cdk-ecrpublic-gc` allows you to deploy a **AWS Step Functions** state machine with [dynamic parallelism](https://aws.amazon.com/tw/blogs/aws/new-step-functions-support-for-dynamic-parallelism/) to invoke an arbitrary of Lambda functions to remove untagged images to release the storage. 

# Schedule


By default, the state machine will be triggered **every 4 hours** and can be configured in the `schedule` property in the `TidyUp` construct.


# Sample

```ts
import * as cdk from '@aws-cdk/core';
import { TidyUp } from 'cdk-ecrpublic-gc';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ecr-public-gc');

new TidyUp(stack, 'TidyUp', {
  repository: [
    'vscode',
    'gitpod-workspace',
    'github-codespace',
  ],
  schedule: events.Schedule.cron({ hour: '*/4', minute: '0' }),
});

```

# In Action

Step Function state machine with dynamic tasks in parallel
![](images/01.png)

![](images/02.png)

