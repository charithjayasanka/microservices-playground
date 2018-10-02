//  twilio.js
//
//  A Hapi Plugin for interfacing with Twilio. Simply creates the twilio client,
//  which can then be used in routes. This is exposed as a plugin so that we can
//  initialise it on server startup, and fail fast if configuration is missing.
const Twilio = require('twilio');

module.exports = {
  name: 'twilio',
  version: '0.0.1',
  register: async (server, options) => {
    //  Get the twilio config. If it is missing, bail out.
    const { sid, authToken, phoneNumber } = options;
    if (!sid) throw new Error("'sid' has not be provided in the twilio client options");
    if (!authToken) throw new Error("'authToken' has not be provided in the twilio client options");
    if (!phoneNumber) throw new Error("'phoneNumber' has not be provided in the twilio client options");

    //  Initialise the client. Assign it to the 'app' so that it is available.
    try {
      const twilioClient = new Twilio(sid, authToken);
      server.app.twilio = twilioClient;
      server.log(['info'], `Created Twilio client with SID ${sid}`);
    } catch (err) {
      throw new Error(`An error occurred creating the twilio client: ${err}`);
    }
  },
};
