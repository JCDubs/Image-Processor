# Image Processor Function

The Image Processor Function provides functionality to resize and convert images through AWS S3 and lambda.

## Setup

The project is provided as a Node.js AWS lambda project, written withe a base version of Node.js 12 >. You should perform the following steps to set the project up.

- Clone the project locally.
- Install NVM if it is not already installed and set the node version as 12.
- Run `yarn` to install all dependencies.

Before deployment, a sandbox, static site and deployment S3 Buckets should be created and the bucket names should be stated in th serverless.yml file.

## Environments

The `serverless.yml` file has been configured to deploy the lambda to a dev, test or prod environment which is achieved by running the sls deploy command specifying the stage to deploy to. By default, if not specified, the stage is set to 'dev'.

## Deployment

It is important that the Sharp node module is installed on the operating system it is intended to be run on. A Dockerfile has been provided within this project to deploy the lambda to AWS. The Dockerfile is configured to run in a similar OS to AWS Lambda ensuring that the Sharp node module is installed in the Docker container OS. The following commands should be run to build the docker image and deploy.

`docker build -t image-proc .`

The lambda should then be deployed with the following command providing the AWS credentials in a volume unless the machine the docker container is being run on has been configured with an IAM role.

`docker run -v ~/.aws:/root/.aws image-proc sls deploy -v -s test`

## Running Locally

The Lambda can be run locally by executing `yarn serve`. The fist time the lambda is run locally, a `buckets` directory will be created in the root of the project containing the test and development equivalent buckets.

## Test

### Unit Tests

Tests are located in the `test/unit` directory consisting of unit tests. The tests can be run by executung the `yarn test` command.

### Integration Tests

The integration tests are located in the `test/integration` directory consisting of cucumber tests. The tests use the local s3 buckets to execute and validate the process of uploading an image to S3, generating the jpeg variant of the image in the local static site bucket. Images can be deleted from the local buckets using the `yarn delete-canned` command. Images can be uploaded to the local buckets using the `yarn upload-canned` command.
