const { AwsCdkConstructLibrary } = require('projen');
const { Automation } = require('projen-automate-it');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  description: 'Garbage collector for Amazon ECR public',
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '1.73.0',
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
    'projen-automate-it',
  ],
  dependabot: false,
  publishToPypi: {
    distName: 'cdk-ecrpublic-gc',
    module: 'cdk_ecrpublic_gc'
  },
});


const automation = new Automation(project, {
  automationToken: AUTOMATION_TOKEN,
});
automation.projenYarnUpgrade();


const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
