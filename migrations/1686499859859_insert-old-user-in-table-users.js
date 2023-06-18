/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
     // membuat user baru.
     pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes')");

     // mengubah nilai owner pada note yang owner-nya bernilai NULL
     pgm.sql("UPDATE playlists SET owner = 'old_notes' WHERE owner IS NULL");
};

exports.down = pgm => {
    // membuat user baru.
    pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes')");

    // mengubah nilai owner pada note yang owner-nya bernilai NULL
    pgm.sql("UPDATE playlists SET owner = 'old_notes' WHERE owner IS NULL");
};
