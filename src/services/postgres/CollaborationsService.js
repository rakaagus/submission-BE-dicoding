const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvarriantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class CollaborationsService{
    constructor(){
        this._pool = new Pool()
    }

    async addCollaboration(playlistId, userId){
        const id = `collab-${nanoid(16)}`

        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new InvariantError('Kolaborasi Gagal')
        }

        return result.rows[0].id
    }

    async deleteCollaboration(playlistId, userId){
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new InvariantError('Kolaborasi Gagal dihapus')
        }
    }

    async verifyCollaboration(playlistId, userId){
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new InvariantError('Kolaborasi Gagal dihapus')
        }
    }

    async verifyUser(userId){
        const query = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [userId],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new NotFoundError('User Tidak ditemukan')
        }
    }
}

module.exports = CollaborationsService;