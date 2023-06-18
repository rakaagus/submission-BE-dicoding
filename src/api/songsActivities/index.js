const SongsActivitiesHandler = require("./handler")
const routes = require('./routes')

module.exports = {
    name: 'songsActivites',
    version: '1.0.0',
    register: async (server, {songsActivitiesService, playlistsService}) => {
        const songsActivitesHandler = new SongsActivitiesHandler(songsActivitiesService, playlistsService)
        server.route(routes(songsActivitesHandler))
    }
}