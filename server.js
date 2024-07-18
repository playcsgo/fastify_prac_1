// server.js
const fastify = require('fastify')({
  logger: false
})
const awilixPlugin = require('./awilixSetup')
const userRoutes = require('./routes/user')
const apiErrorHandler = require('./error/api-error-handler')

// apply worker_threads
// const { Worker } = require('worker_threads')


// register kits
fastify.register(awilixPlugin)

// register routes
fastify.register(userRoutes)


// init workers
fastify.addHook('onReady', async () => {
  await fastify.di.cradle.work1
  await fastify.di.cradle.work2
});


// connect mongoDB with Hook.onReady
fastify.addHook('onReady', async () => {
  // Some async code
  await fastify.di.cradle.mongoose
})

fastify.setErrorHandler(apiErrorHandler)

// Run the server! '0.0.0.0' or :: for all IPV6
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`server running on ${address}`)
})