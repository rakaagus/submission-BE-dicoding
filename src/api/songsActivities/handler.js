const autoBind = require("auto-bind")

class SongsActivitiesHandler {
    constructor(songsActivitiesService, playlistsService){
        this._songsActivitiesService = songsActivitiesService
        this._playlistsService = playlistsService

        autoBind(this)
    }

    async getSongActivitiesHandler(request, h){
        const { id: credentialId } = request.auth.credentials
        const { id } = request.params

        await this._playlistsService.checkPlaylists(id)
        await this._playlistsService.verifyPlaylistAccess(id, credentialId)
        const activities = await this._songsActivitiesService.getSongActivites(id)
        
        return {
            status: "success",
            data: {
                playlistId: id,
                activities,
            },
        }
    }
}

module.exports = SongsActivitiesHandler