const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvarriantError");

class SongsActivitiesService {
    constructor(){
        this._pool = new Pool()
    }

    async addSongActivities(playlistId, songId, userId, action){
        const id = nanoid(16)
        const timeStamp = new Date().toISOString()
        const updateAt = timeStamp
        const createAt = timeStamp

        const query = {
            text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [id, playlistId, songId, userId, action, timeStamp, createAt, updateAt]
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].id){
            throw new InvariantError('Aktifiktas lagu gagal dibuat')
        }
    }

    async getSongActivites(id){
        const query = {
            text: `SELECT users.username, songs.title, playlist_song_activities.action playlist_song_activities.time, FROM playlist_song_activities
            INNER JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
            INNER JOIN users ON users.id = playlist_song_activities.user_id
            INNER JOIN songs ON songs.id = playlist_song_activities.song_id
            WHERE playlist_song_activities.playlist_id = $1`,
            values: [id]
        }

        const result = await this._pool.query(query)

        return result.rows
    }
}

module.exports = SongsActivitiesService