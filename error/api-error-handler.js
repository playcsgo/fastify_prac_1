const ApiError = require('./api-error');

async function apiErrorHandler(error, request, reply, next) {
  console.log(error);

  if (error instanceof ApiError) {
    reply.status(error.code).send({ error: error.message });
  } else {
    reply.status(500).send({ error: 'something went wrong in my code' });
  }
  next()
}

module.exports = apiErrorHandler;
