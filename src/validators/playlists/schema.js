const Joi = require("joi");

const PostPlaylistSchema = Joi.object({
    name: Joi.string().required()
})

const UpdateSongInPlaylistSchema = Joi.object({
    songId: Joi.string().required()
})

module.exports = {
    PostPlaylistSchema,
    UpdateSongInPlaylistSchema
}