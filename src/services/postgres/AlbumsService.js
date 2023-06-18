const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvarriantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToAlbumSongService } = require("../../utils");

class AlbumsService {
    constructor(){
        this._pool = new Pool()
    }

    async addAlbum({name, year}){
        const id = nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query)
    
        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan')
        }
    
        return result.rows.map(mapDBToAlbumSongService)[0]
    }

    async editAlbumById(id, {name, year}){
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAmbumById(id){
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
        throw new NotFoundError('Gagal hapus albums. Id tidak ditemukan');
        }
    }

    async getSongsInAlbum(id){
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id]
        }
        
        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }
    
        return result.rows;
    }
}

module.exports = AlbumsService