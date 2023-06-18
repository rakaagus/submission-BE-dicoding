const routes = (handler) => [
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: handler.getSongActivitiesHandler,
        options: {
            auth: "openmusik_jwt",
        },
    }
]

module.exports = routes