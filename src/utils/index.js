const mapDBToModel = ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration, 
    albumId,
}) => ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration, 
    albumId,
})

const mapToSongInAlbum = songs => ({
    id,
    name,
    year,
    songs: songs
});

const mapDBToAlbumSongService = ({
    id, 
    name, 
    year, 
}) => ({
    id, 
    name, 
    year,
})

const mapDBToGetAllSong = ({
    id, 
    title, 
    performer, 
}) => ({
    id, 
    title, 
    performer,
})

module.exports = { mapDBToModel, mapDBToAlbumSongService, mapDBToGetAllSong, mapToSongInAlbum };