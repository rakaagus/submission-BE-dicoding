const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvarriantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToGetAllSong, mapDBToModel } = require("../../utils");

class SongsService {
    constructor(){
        this._pool = new Pool()
    }

    async addSong({title, year, genre, performer, duration, albumId}){
        const id = nanoid(16)
        const createdAt = new Date().toDateString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].id){
            throw new InvariantError('Song gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getSongs({title, performer}){
        let query = {}

        if(title && performer){
            query = {
                text: "SELECT id, title, performer FROM songs LOWER(title) LIKE '%'||LOWER($1)||'%' AND LOWER(performer) LIKE '%'||LOWER($2)||'%'",
                values: [title, performer]
            }
        }else if(title){
            query = {
                text: "SELECT id, title, performer FROM songs LOWER(title) LIKE '%'||LOWER($1)||'%'",
                values: [title]
            }
        }else if(performer){
            query = {
                text: "SELECT id, title, performer FROM songs LOWER(performer) LIKE '%'||LOWER($2)||'%'",
                values: [performer]
            }
        }else {
            query = {
                text: "SELECT id, title, performer FROM songs",
            }
        }
        
        const result = await this._pool.query(query)
        return result.rows;
    }

    async getSongById(id){
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }
    
        return result.rows.map(mapDBToModel)[0];
    }

    async editSongById(id, {title, year, genre, performer, duration, albumId}){
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui songs. Id tidak ditemukan');
        }
    }

    async deleteSongById(id){
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
            throw new NotFoundError('Gagal hapus songs. Id tidak ditemukan');
        }
    }

}

module.exports = SongsService