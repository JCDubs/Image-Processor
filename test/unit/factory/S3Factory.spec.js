const chai = require('chai')
const sinon = require('sinon')
const S3Factory = require('../../../src/factory/S3Factory').S3Factory
const expect = chai.expect
let sandbox = null

class Endpoint {
    constructor(url) {
        this.url = url
    }
}

class S3 {
    constructor(config) {
        this.config = config
    }
}

const mockAws  = {
    S3: S3,
    Endpoint: Endpoint
}

describe('Test the S3Factory', () => {

    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it ('Test dev mode', () => {
        process.env.ENV = 'dev'
        process.env.S3_HOST = 'some/host'
        process.env.S3_PORT = '8000'
        const s3Factory = new S3Factory(mockAws)
        const s3 = s3Factory.getS3()
        expect(s3.config).to.eql({
            s3ForcePathStyle: true,
            endpoint: new Endpoint(`http://some/host:8000`)
        })
    })
})
