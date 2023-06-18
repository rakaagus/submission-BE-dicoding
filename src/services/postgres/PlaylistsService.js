const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvarriantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class PlaylistsService {
    constructor(collaborationsService){
        this._pool = new Pool
        this._collaborationsService = collaborationsService
    }

    async addPlaylist(name, owner){
        const id = nanoid(16);

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new InvariantError('Gagal Membuat Playlits')
        }

        return result.rows[0].id
    }

    async checkPlaylists(id){
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new NotFoundError('Playlists tidak ditemukan')
        }
    }

    async deletePlaylistById(id){
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new NotFoundError('Gagal hapus playlists. Playlist yang anda maksudkan tidak ada')
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        }
    
        const result = await this._pool.query(query)
    
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan')
        }
    
        const playlist = result.rows[0]
    
        if (playlist.owner !== owner) {
            throw new AuthenticationError('Anda tidak berhak mengakses resource ini')
        }
    }

    async addSongToPlaylist(playlistId, songId){
        const id =  nanoid(16)
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].id){
            throw new InvariantError('Gagal menambahkan lagu ke playlists')
        }
    }

    async deleteSongInPlaylist(playlistId, songId){
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new NotFoundError('Gagal menghapus lagu dari playlists')
        }
    }

    async getPlaylist(owner){
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            INNER JOIN users ON users.id = playlists.owner
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
            values: [owner]
        }

        const result = await this._pool.query(query)

        return result.rows
    }

    async getPlaylistById(playlistId, credentialId){
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            INNER JOIN users ON users.id = playlists.owner
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE (playlists.owner = $1 OR collaborations.user_id = $1) AND playlists.id = $2`,
            values: [credentialId, playlistId]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new NotFoundError('Playlist tidak ditemukan')
        }

        return result.rows[0]
    }

    async getSongInPlaylistById(id){
        const query = {
            text: `SELECT songs.title, songs.genre, songs.performer, songs.duration FROM playlist_songs
            INNER JOIN songs ON songs.id = playlist_songs.song_id
            INNER JOIN playlists ON playlists.id = playlist_songs.playlist_id
            WHERE playlist_songs.playlist_id = $1`,
            values: [id]
        }

        const result = await this._pool.query(query)
        return result.rows
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaboration(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistsService