const chai = require('chai')
const S3Service = require('../../../src/service/S3Service').S3Service
const expect = chai.expect
const assert = chai.assert
const testImage = 'image data'

describe('Test the S3Service', () => {

    describe('Test getObject', () => {

        it('getObject test with successful response', async () => {
            const response = { Body: testImage, ContentType: 'text/html', ContentLength: 30 }
            const s3Service = new S3Service(createS3Mock(response))
            const object = await s3Service.getObject('testBucket', 'someAsset.html')
            expect(object).to.eql(testImage)
        })

        it('getObject test with null response', async () => {
            const s3Service = new S3Service(createS3Mock(null))
            const response = await s3Service.getObject('testBucket', 'someAsset.html')
            expect(response).to.be.null
        })

        it('getObject test with error', async () => {
            const s3Service = new S3Service(createS3Mock(null, true))
            const response = await s3Service.getObject('testBucket', 'someAsset.html')
            expect(response).to.be.undefined
        })
    })

    describe('Test the saveImage functon', () => {

        it('Test saveImage with success response', async () => {
            const expectedResponse = 'SUCCESS'
            const s3Service = new S3Service(createS3Mock(expectedResponse))
            const response = await s3Service.saveImage('testBucket', 'someKey', 'some content')
            expect(response).to.eql(expectedResponse)
        })

        it('Test saveImage with success response with / in key', async () => {
            const expectedResponse = 'SUCCESS'
            const s3Service = new S3Service(createS3Mock(expectedResponse))
            const response = await s3Service.saveImage('testBucket', '/someKey', 'some content')
            expect(response).to.eql(expectedResponse)
        })

        it('Test saveImage with error', async () => {
            const s3Service = new S3Service(createS3Mock(null, true))
            const response = await s3Service.saveImage('testBucket', 'someKey', 'some content')
            expect(response).to.be.undefined
        })
    })

    const createS3Mock = (response, throwError) => {
        return {
            getObject: () => {
                return {
                    promise: () => {
                        return new Promise((resolve, reject) => {
                            if (throwError) {
                                reject(response)
                                return
                            }
                            resolve(response)
                        })
                    }
                }
            },
            putObject: () => {
                return {
                    promise: () => {
                        return new Promise((resolve, reject) => {
                            if (throwError) {
                                reject(response)
                                return
                            }
                            resolve(response)
                        })
                    }
                }
            }
        }
    }
})