const InvariantError = require("../../exceptions/InvarriantError");
const { AlbumPayloadSchema } = require("./schema");

const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = AlbumsValidator