const ApiError = require('./api-error');

async function apiErrorHandler(error, request, reply) {
  console.log(error);

  if (error instanceof ApiError) {
    reply.status(error.code).send({ error: error.message });
  } else {
    reply.status(500).send({ error: 'something went wrong' });
  }
}

module.exports = apiErrorHandler;