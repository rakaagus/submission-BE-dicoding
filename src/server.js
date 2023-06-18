require('dotenv').config();

// hapi extension
const Hapi = require('@hapi/hapi');
const Jwt = require("@hapi/jwt");

// albums
const albums = require('./api/album');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validators/albums');

// songs
const songs = require('./api/song');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validators/songs');

// users
const users = require('./api/user');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validators/users');

// authentications
const authentications = require('./api/authentication');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validators/authentications');

// playlist
const playlists = require('./api/playlist');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validators/playlists');

// collaborations
const collaborations = require('./api/collaboration');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validators/collaborations');

// songs activities
const songsActivites = require('./api/songsActivities');
const SongsActivitiesService = require('./services/postgres/SongsActivitiesService');


// error handling
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService()
  const playlistsService = new PlaylistsService(collaborationsService)
  const songsActivitiesService = new SongsActivitiesService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusik_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService: albumsService,
        validator: AlbumsValidator,
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: playlists,
      options: {
        playlistsService: playlistsService,
        songsService: songsService,
        songsActivitesService: songsActivitiesService,
        validator: PlaylistsValidator,
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService: collaborationsService,
        playlistService: playlistsService,
        validator: CollaborationsValidator,
      }
    },
    {
      plugin: songsActivites,
      options: {
        songsActivitiesService: songsActivitiesService,
        playlistsService: playlistsService
      }
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {

      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
