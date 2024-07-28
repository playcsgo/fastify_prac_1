// server.js
const fastify = require('fastify')({
  logger: false
})
const awilixPlugin = require('./awilixSetup')
const apiErrorHandler = require('./error/api-error-handler')
const userRoutes = require('./routes/user')
const fibRoutes = require('./routes/fib')
const fastifyCookie = require('@fastify/cookie')
const fastifySession = require('@fastify/session')
const fastifyPassport = require('@fastify/passport')

// apply worker_threads
// const { Worker } = require('worker_threads')

// register plugins
fastify.register(awilixPlugin)
fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  secret: 'the secret must have length 32 or greater',
  cookie: { secure: false } // true for HTTP 
})
fastify.register(fastifyPassport.initialize())
fastify.register(fastifyPassport.secureSession())


// register services
fastify.setErrorHandler(apiErrorHandler)

// register routes
fastify.register(userRoutes, { prefix: '/v1' })
fastify.register(fibRoutes, { prefix: '/fib' })


// init workers
fastify.addHook('onReady', async () => {
  try {
    // init works
    await fastify.di.cradle.worker1
    await fastify.di.cradle.worker2
    // await fastify.di.cradle.worker3
    // await fastify.di.cradle.worker4

    // check mongoDB connection
    await fastify.di.cradle.mongoose

    // set passport stragegy
    await fastify.di.cradle.setPassport

  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
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