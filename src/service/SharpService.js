'use strict'
const sharp = require('sharp')

class SharpService {

    constructor(sharp) {
        this.sharp = sharp
    }

    async convertImage(imageData, imagesSize) {
        return await this.sharp(imageData)
            .resize(imagesSize[0], imagesSize[1])
            .jpeg({ progressive: true })
            .toBuffer()
    }

    async isValidSize(imageData, imagesSize) {
        const metaData = await this.sharp(imageData).metadata()
        return metaData.width >= imagesSize[0] && metaData.height >= imagesSize[1]
    }
}
module.exports = {
    sharpService: new SharpService(sharp),
    SharpService: SharpService
}
