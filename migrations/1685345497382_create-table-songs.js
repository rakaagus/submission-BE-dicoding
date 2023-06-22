/* eslint-disable camelcase */


exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        year: {
            type: 'INTEGER',
            notNull: true
        },
        genre: {
            type: 'TEXT',
            notNull: true
        },
        performer: {
            type: 'TEXT',
            notNull: true
        },
        duration: {
            type: 'INTEGER',
            notNull: false
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: false
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    })

    // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
    pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('songs');
    pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
};
