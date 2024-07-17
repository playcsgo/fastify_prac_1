// server.js
const fastify = require('fastify')({
  logger: true
})
const awilixPlugin = require('./awilixSetup')
const userRoutes = require('./routes/user')
const apiErrorHandler = require('./error/api-error-handler')


// register kits
fastify.register(awilixPlugin)
fastify.register(userRoutes)

// routes route



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