'use strict'
const s3Factory = require('../factory/S3Factory').s3Factory

class S3Service {

    constructor(s3) {
        this.s3 = s3
    }

    getObject(bucketName, key) {
        return this.s3.getObject({ Bucket: bucketName, Key: key }).promise()
            .then((response) => {
                return response && response.Body ? response.Body : null
            }).catch(error => console.error(`Error thrown trying to get ${bucketName}:${key}`, error))
    }

    saveImage(bucketName, key, data) {
        return this.s3.putObject({
            Bucket: bucketName,
            Key: key.startsWith('/') ? key.substring(1) : key,
            Body: data
        })
            .promise()
            .catch(error => console.error(`Error thrown trying to put ${bucketName}:${key}`, error))
    }
}
module.exports = {
    s3Service: new S3Service(s3Factory.getS3()),
    S3Service: S3Service
}
