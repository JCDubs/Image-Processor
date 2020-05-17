'use strict'
const chai = require('chai')
const handler = require('../../../src/handler/handler')
const s3Service = require('../../../src/service/S3Service').s3Service
const sharpService = require('../../../src/service/SharpService').sharpService
const sinon = require('sinon')
const expect = chai.expect
let sandbox

describe('Handler Test', () => {

    describe('Test null checks.', () => {

        it('get with a null event', async () => {
            const response = await handler.processImage(null)
            console.log(response)
            expect(JSON.parse(response.body).message).to.deep.equal('Please provide a valid S3 trigger event')
        })

        it('get with null Records', async () => {
            const response = await handler.processImage({})
            expect(JSON.parse(response.body).message).to.deep.equal('Please provide a valid S3 trigger event')
        })

        it('get with empty Records', async () => {
            const response = await handler.processImage({ Records: [] })
            expect(JSON.parse(response.body).message).to.deep.equal('Please provide a valid S3 trigger event')
        })

        it('get with null S3', async () => {
            const response = await handler.processImage({ Records: [{}] })
            expect(JSON.parse(response.body).message).to.deep.equal('Please provide a valid S3 trigger event')
        })

        it('get with null S3 Object', async () => {
            const response = await handler.processImage({ Records: [{ s3: {} }] })
            expect(JSON.parse(response.body).message).to.deep.equal('Please provide a valid S3 trigger event')
        })

        it('get with null S3 Object Key', async () => {
            const response = await handler.processImage({ Records: [{ s3: { object: {} } }] })
            expect(JSON.parse(response.body).message).to.deep.equal('Please provide a valid S3 trigger event')
        })
    })

    describe('Test processImage call.', () => {
        beforeEach(() => sandbox = sinon.createSandbox())
        afterEach(() => sandbox.restore())

        it('processImage with successful call.', async () => {
            sandbox.stub(s3Service, 'getObject').resolves('image data')
            sandbox.stub(sharpService, 'isValidSize').returns(true)
            sandbox.stub(sharpService, 'convertImage').resolves('Test Data')
            const saveImageStub = sandbox.stub(s3Service, 'saveImage').callsFake(() => new Promise((resolve) => resolve(null)))
            const response = await handler.processImage({ Records: [{ s3: { object: { key: 'testKey' } } }] })
            expect(response.statusCode).to.equal(200)
            sinon.assert.callCount(saveImageStub, 1)
        })

        it('processImage with invalid size.', async () => {
            sandbox.stub(s3Service, 'getObject').resolves('image data')
            sandbox.stub(sharpService, 'isValidSize').resolves(false)
            const response = await handler.processImage({ Records: [{ s3: { object: { key: 'testKey' } } }] })
            expect(response.statusCode).to.equal(500)
            expect(response.body).to.equal('{"message":"Cannot resize testKey. The original height or width is less than the desired values of [274,377]"}')
        })

        it('processImage with error call.', async () => {
            sandbox.stub(s3Service, 'getObject').rejects({ message: 'Test Error' })
            const response = await handler.processImage({ Records: [{ s3: { object: { key: 'testKey' } } }] })
            expect(JSON.parse(response.body).message).to.equal('Test Error')
        })
    })
})
