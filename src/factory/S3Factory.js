'use strict'
const AWS = require('aws-sdk')

class S3Factory {

    constructor(aws) {
        if ('dev' === process.env.ENV) {
            console.log('Setting dev host')
            this.s3 = new aws.S3({
                s3ForcePathStyle: true,
                endpoint: new aws.Endpoint(`http://${process.env.S3_HOST}:${process.env.S3_PORT}`)
            })
        } else {
            this.s3 = new aws.S3()
        }
    }

    getS3() {
        return this.s3
    }
}

const s3Factory = new S3Factory(AWS)
module.exports = {s3Factory, S3Factory}
