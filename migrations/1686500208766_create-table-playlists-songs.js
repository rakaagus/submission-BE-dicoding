/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // membuat table playlists_songs
    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    /*
        Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan song_id.
        Guna menghindari duplikasi data antara nilai keduanya.
    */
    pgm.addConstraint('playlist_songs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
    
    // memberikan constraint foreign key pada kolom playlist_id dan song_id terhadap notes.id dan users.id
    pgm.addConstraint('playlist_songs', 'fk_playlists_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_songs', 'fk_playlists_songs.song_id_songs.id', 'FOREIGN KEY(playlist_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    // menghapus tabel playlists_songs
    pgm.dropTable('playlist_songs');
};
