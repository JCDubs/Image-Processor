# Canned Data

## Intro

The canned data directory is used to store data required for local development and test. The directory consists of two directories required to mimic S3 buckets and objects:

### content

The content directory contains the content config file required by the SSR renderer to retrieve the content to populate the page template.

### template 

The template directory contains the files provided by the assets bucket and directory in S3. It contains the template.html, client module and server side bundle files.

## Usage

The canned data files can be uploaded to the local mock S3 service via the following yarn command:

```
yarn upload-canned # Upload all canned data to the s3 mock service.
yarn delete-content # Deletes the content file from the s3 mock service.
yarn upload-content # Uploads the content file to the s3 mock service to trigger the lambda. 
```

It is advised that the client manifest and server renderer bundle are replaced with a new build of the client manifest and server renderer bundle to ensure the logic is up to date. 