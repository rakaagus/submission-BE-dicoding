const InvariantError = require("../../exceptions/InvarriantError")
const SongPayloadSchema = require("./schema")

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = SongsValidator