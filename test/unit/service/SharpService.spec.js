'use strict'

const chai = require('chai')
const sinon = require('sinon')
const SharpService = require('../../../src/service/SharpService').SharpService
const expect = chai.expect
let sandbox

describe('Test the SharpService', () => {

    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('convertImage test', async () => {
        const expectedImageData = 'Test Data'
        const testData = 'Test image data'
        const testSizeData = [200, 200]
        const bufferStub = sandbox.stub().returns(expectedImageData)
        const jpegStub = sandbox.stub().returns({ toBuffer: bufferStub })
        const resizeStub = sandbox.stub().returns({ jpeg: jpegStub })
        const sharpStub = sandbox.stub().returns({ resize: resizeStub })
        const sharpService = new SharpService(sharpStub)
        const imageData = await sharpService.convertImage(testData, testSizeData)
        expect(imageData).to.eql(expectedImageData)
        sandbox.assert.calledWith(sharpStub, testData)
        sandbox.assert.calledWith(resizeStub, testSizeData[0], testSizeData[1])
        sandbox.assert.calledWith(jpegStub, { progressive: true })
        sandbox.assert.calledOnce(bufferStub)
    })

    it('isValidSize test with valid size', async () => {
        const testData = 'Test image data'
        const testSizeData = [200, 200]
        const metaDataStub = sandbox.stub().returns({ width: 200, height: 200 })
        const sharpStub = sandbox.stub().returns({ metadata: metaDataStub })
        const sharpService = new SharpService(sharpStub)
        expect(await sharpService.isValidSize(testData, testSizeData)).to.be.true
        sandbox.assert.calledWith(sharpStub, testData)
        sandbox.assert.calledOnce(metaDataStub)
    })

    it('isValidSize test with invalid width', async () => {
        const testData = 'Test image data'
        const testSizeData = [200, 200]
        const metaDataStub = sandbox.stub().returns({ width: 100, height: 200 })
        const sharpStub = sandbox.stub().returns({ metadata: metaDataStub })
        const sharpService = new SharpService(sharpStub)
        expect(await sharpService.isValidSize(testData, testSizeData)).to.be.false
        sandbox.assert.calledWith(sharpStub, testData)
        sandbox.assert.calledOnce(metaDataStub)
    })

    it('isValidSize test with invalid height', async () => {
        const testData = 'Test image data'
        const testSizeData = [200, 200]
        const metaDataStub = sandbox.stub().returns({ width: 200, height: 100 })
        const sharpStub = sandbox.stub().returns({ metadata: metaDataStub })
        const sharpService = new SharpService(sharpStub)
        expect(await sharpService.isValidSize(testData, testSizeData)).to.be.false
        sandbox.assert.calledWith(sharpStub, testData)
        sandbox.assert.calledOnce(metaDataStub)
    })

    it('isValidSize test with invalid width and height', async () => {
        const testData = 'Test image data'
        const testSizeData = [200, 200]
        const metaDataStub = sandbox.stub().returns({ width: 100, height: 100 })
        const sharpStub = sandbox.stub().returns({ metadata: metaDataStub })
        const sharpService = new SharpService(sharpStub)
        expect(await sharpService.isValidSize(testData, testSizeData)).to.be.false
        sandbox.assert.calledWith(sharpStub, testData)
        sandbox.assert.calledOnce(metaDataStub)
    })
})
