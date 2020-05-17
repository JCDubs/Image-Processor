'use strict'
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const s3Service = require('../../../../src/service/S3Service').s3Service
const { Given, Then } = require('cucumber')
const { expect } = require('chai')
const applicationRoot = path.join(__dirname, '../../../../')

Given('the application is running', function () {
  const logFile = fs.readFileSync(path.join(applicationRoot, 'out.log'))
  expect(logFile.includes('Serverless: Offline listening on http://localhost:3000')).to.be.true
})

Given('the {string} image file does not exist', function (contentFileName) {
  return expect(fs.existsSync(path.join(applicationRoot, `buckets/${contentFileName}`))).to.be.false
})

Then('the buckets directory should exist', function () {
  return expect(fs.existsSync(path.join(applicationRoot, `buckets`))).to.be.true
})

Then('the {string} bucket should exist', function (bucket) {
  return expect(fs.existsSync(path.join(applicationRoot, `buckets/${bucket}`))).to.be.true
})

Then('I upload the {string} image file to the {string} bucket with key {string}', async (contentFile, bucket, key) => {
  const content = fs.readFileSync(path.join(applicationRoot, contentFile))
  const s3Response = await s3Service.saveImage(bucket, key, content)
  return expect(s3Response).to.be.not.null
})

Then('I wait {int} milliseconds', async (milliseconds) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds)
  })
})

Then('the {string} image should be present in the {string} bucket', (image, bucket) => {
  return expect(fs.existsSync(path.join(applicationRoot, `buckets/${bucket}/${image}`))).to.be.true
})

Then('the {string} image size should be {int} wide and {int} high', async (image, width, height) => {
  const imageData = await s3Service.getObject('site-images-dev', image)
  const metaData = await sharp(imageData).metadata()
  return metaData.width === width && metaData.height === height
})
