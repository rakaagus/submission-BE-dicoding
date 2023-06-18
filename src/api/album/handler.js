// const ClientError = require("../../exceptions/ClientError")
const autoBind = require('auto-bind');

class AlbumsHandler {
    constructor(albumsService, validator){
        this._albumsService = albumsService
        this._validator = validator

        autoBind(this)
    }

    async postAlbumHandler(request, h){
        this._validator.validateAlbumPayload(request.payload)
        const {name = 'untitled', year} = request.payload
        const albumId = await this._albumsService.addAlbum({name, year})

        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    async getAlbumByIdHandler(request, h){
        const { id } = request.params
        const album = await this._albumsService.getAlbumById(id)
        const songs = await this._albumsService.getSongsInAlbum(id)
        return {
            status: 'success',
            data: {
                album: {
                    ...album,
                    songs
                },
            },
        };
    }

    async putAlbumByIdHandler(request, h){
        this._validator.validateAlbumPayload(request.payload)
        const {id} = request.params
        await this._albumsService.editAlbumById(id, request.payload);
        return {
            status: 'success',
            message: 'Album berhasil diperbarui',
        };
    }

    async deleteAlbumByIdHandler(request, h){
        const {id} = request.params
        await this._albumsService.deleteAmbumById(id)

        return {
            status: 'success',
            message: 'Album berhasil dihapus',
        };
    }
}

module.exports = AlbumsHandler