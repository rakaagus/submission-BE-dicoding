const InvariantError = require("../../exceptions/InvarriantError")
const { PostPlaylistSchema, UpdateSongInPlaylistSchema } = require('./schema')

const PlaylistValidator = {
    validatePostPlaylistPayload: (payload) => {
        const validationResult = PostPlaylistSchema.validate(payload)

        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateUpdateSongPlaylistPayload: (payload) => {
        const validationResult = UpdateSongInPlaylistSchema.validate(payload)

        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = PlaylistValidator