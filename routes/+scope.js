
const FastifyCors = require("fastify-cors");
module.exports = async (server) => {
  await server.register(FastifyCors, {
    origin: true, // allow requests from any domain
  });
};

