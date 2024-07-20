// server.js
const fastify = require('fastify')({
  logger: false
})
const awilixPlugin = require('./awilixSetup')
const apiErrorHandler = require('./error/api-error-handler')
const userRoutes = require('./routes/user')
// apply worker_threads
// const { Worker } = require('worker_threads')


// register plugins
fastify.register(awilixPlugin)


// register services
fastify.setErrorHandler(apiErrorHandler)

// register routes
fastify.register(userRoutes, { prefix: '/v1' })

// init workers
fastify.addHook('onReady', async () => {
  try {
    // init works
    await fastify.di.cradle.worker1
    await fastify.di.cradle.worker2

    // check mongoDB connection
    await fastify.di.cradle.mongoose    

  } catch (err) {
    fastify.log.error('Error Hook onReady:', err);
    process.exit(1);
  }
})


// Run the server! '0.0.0.0' or :: for all IPV6
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`server running on ${address}`)
})