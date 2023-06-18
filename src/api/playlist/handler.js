const autoBind = require("auto-bind")

class PlaylistsHandler {
    constructor(playlistsService, songsService, songsActivitesService, validator){
        this._playlistsService = playlistsService
        this._songsService = songsService
        this._songsActivitesService = songsActivitesService
        this._validator = validator

        autoBind(this)
    }

    async postPlaylistHander(request, h){
        this._validator.validatePostPlaylistPayload(request.payload)
        const { name } = request.payload
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._playlistsService.addPlaylist(
            name, 
            credentialId
        )

        const response = h.response({
            status: "success",
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request, h){
        const { id: credentialId } = request.auth.credentials;

        const playlists = await this._playlistsService.getPlaylist(credentialId)

        return {
            status: "success",
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistHandler(request, h){
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(id, credentialId)
        await this._playlistsService.deletePlaylistById(id)

        return {
            status: "success",
            message: "Playlist berhasil dihapus",
        };
    }

    async postSongToPlaylistHandler(request, h){
        this._validator.validateUpdateSongPlaylistPayload(request.payload)
        const { songId } = request.payload
        const { id: credentialId } = request.auth.credentials;
        const { id } = request.params

        // memeriksa apakah lagu yang dimaksud ada
        await this._songsService.getSongById(songId)
        //memeriksan akses playlist dengan id dan credentialsId
        await this._playlistsService.verifyPlaylistAccess(id, credentialId);
        await this._playlistsService.addSongToPlaylist(id, songId)

        const action = 'Add'

        //Auto Insert SongsActivities
        await this.__songsActivitesService.addSongActivities(
            id,
            songId, 
            credentialId,
            action
        )

        const response = h.response({
            status: "success",
            message: "Lagu berhasil ditambahkan ke dalam playlist",
        });
        response.code(201);
        return response;
    }

    async getSongsInPlaylistHandler(request, h){
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(id, credentialId)
        const playlist = await this._playlistsService.getPlaylistById(id, credentialId)
        const songs = await this._playlistsService.getSongInPlaylistById(id)

        return {
            status: "success",
            data: {
                playlist: {
                    ...playlist,
                    songs,
                },
            },
        }
    }

    async deleteSongsInPlaylistHandler(request, h){
        this._validator.validateUpdateSongPlaylistPayload(request.payload)
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials
        const { songId } = request.payload

        // memeriksa apakah lagu yang dimaksud ada
        await this._songsService.getSongById(songId)
        //memeriksan akses playlist dengan id dan credentialsId
        await this._playlistsService.verifyPlaylistAccess(id, credentialId)
        await this._playlistsService.deleteSongInPlaylist(id, credentialId)

        const action = 'Delete'

        //Auto Insert SongsActivities
        await this.__songsActivitesService.addSongActivities(
            id,
            songId, 
            credentialId,
            action
        )

        return {
            status: "success",
            message: "Lagu berhasil dihapus dari playlist",
        }
    }
}

module.exports = PlaylistsHandler