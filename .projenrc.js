const { AwsCdkConstructLibrary, DependenciesUpgradeMechanism } = require('projen');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  description: 'Garbage collector for Amazon ECR public',
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '1.95.1',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-ecrpublic-gc',
  repositoryUrl: 'https://github.com/pahudnet/cdk-ecrpublic-gc.git',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-stepfunctions',
    '@aws-cdk/aws-stepfunctions-tasks',
    '@aws-cdk/aws-events',
    '@aws-cdk/aws-events-targets',
  ],
  devDeps: [
    'aws-sdk',
    'esbuild',
  ],
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud'],
  },
  publishToPypi: {
    distName: 'cdk-ecrpublic-gc',
    module: 'cdk_ecrpublic_gc',
  },
  keywords: ['cdk', 'ecr', 'repository', 'gc', 'docker'],
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
