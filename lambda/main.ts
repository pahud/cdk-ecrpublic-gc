import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

const ecrpublic = new AWS.ECRPUBLIC({
  region: 'us-east-1',
});

async function clean(repositoryName: string) {
  const param: AWS.ECRPUBLIC.DescribeImagesRequest = {
    repositoryName,
    maxResults: 100,
  };

  let response = await findAndDeleteImages(repositoryName, param);

  while (response.nextToken) {
    response = await findAndDeleteImages(repositoryName, {
      nextToken: response.nextToken,
      ...param,
    });
    console.log(`2next token: ${response.nextToken}`);
    // if (response.nextToken) console.log(`2next token: ${response.nextToken}`)
  }
}

async function deleteImages(repositoryName: string, imageIds: AWS.ECRPUBLIC.ImageIdentifierList) {
  const param: AWS.ECRPUBLIC.BatchDeleteImageRequest = {
    repositoryName,
    imageIds,
  };
  const response = await ecrpublic.batchDeleteImage(param).promise();

  console.log(response.imageIds);
}

async function findAndDeleteImages(repositoryName: string, params: AWS.ECRPUBLIC.DescribeImagesRequest)
  : Promise<PromiseResult<AWS.ECRPUBLIC.DescribeImagesResponse, AWS.AWSError>> {
  let response = await ecrpublic.describeImages(params).promise();
  const imageIds = response.imageDetails?.filter(x => !x.imageTags).map(x => ({ imageDigest: x.imageDigest }));
  if (imageIds && imageIds.length > 0) {
    await deleteImages(repositoryName, imageIds!);
    console.log(`next token: ${response.nextToken}`);
  }
  return response;
}

export async function handler(event: any) {
  console.log(JSON.stringify(event));
  console.log(`repo: ${event.REPO}`);
  const repo = event.REPO;
  await clean(repo!);
}


