//  create.js
//
//  Exposes a single, asynchronous function which creates a server, returning
//  the server object ready to be started.
const Hapi = require('hapi');
const good = require('good');
const vision = require('vision');
const inert = require('inert');
const hapiSwagger = require('hapi-swagger');

const twilio = require('../plugins/twilio');
const pack = require('../../package.json');

async function create() {
  // Create a server with a host and port
  const server = Hapi.server({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    routes: {
      //  Enable CORs - we use it for Hapi Swagger etc.
      cors: true,
    },
  });

  //  Set up a simple console log.
  await server.register({
    plugin: good,
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', request: '*', response: '*' }],
        }, {
          module: 'good-console',
        }, 'stdout'],
      },
    },
  });

  //  Register Hapi Swagger, and its dependencies.
  await server.register([
    inert,
    vision,
    {
      plugin: hapiSwagger,
      options: {
        documentationPath: '/',
        info: {
          title: pack.name,
          description: pack.description,
          version: pack.version,
        },
      },
    },
  ]);

  //  Get Twilio config and initialise Twilio.
  await server.register({
    plugin: twilio,
    options: {
      sid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
  });

  return server;
}

module.exports = create;
