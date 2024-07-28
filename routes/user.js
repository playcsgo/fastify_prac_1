// routes/user.js
module.exports = function userRoutes (fastify, opts, done) {
  // because routes register with prefix '/v1'
  // POST '/users' should be POST '/v1/users' while requesting

  //check history
  fastify.get('/history', async(request, reply) => {
    await fastify.di.cradle.userController.showHistory(request, reply)
  })

  //signin
  fastify.post('/signin', 
  { preValidation: fastify.di.cradle.fastifyPassport.authenticate('local', { session: false }) },
  async(request, reply) => {
    fastify.di.cradle.userController.signIn(request, reply)
  }
  )

  // create user
  fastify.post('/users',
    { schema: fastify.di.cradle.jsonSchema.postUsers }, 
    (request, reply) => { fastify.di.cradle.userController.createUser(request, reply) }
    )

  // getUser
  fastify.get('/:id',
  { 
    preValidation: fastify.di.cradle.middlewareAuth.apiAuthenticated,
    preHandler: fastify.di.cradle.middlewareMonitor
  },
  async(request, reply) => {
    const { getUser } = fastify.di.cradle.userController
    const user = await getUser(request, reply)
    reply.send({ data: user })
  })

  // user bet
  fastify.post('/betonetofour', 
    { 
      preValidation: fastify.di.cradle.middlewareAuth.apiAuthenticated,
      preHandler: fastify.di.cradle.middlewareMonitor
    },
    async(request, reply) => {
      const { betOnetoFour } = fastify.di.cradle.userController
      const user = await betOnetoFour(request, reply)
      reply.send({ data: user })
  })

  // user add or remove friend 
  fastify.post('/friends/:friendId', async(request, reply) => {
    const { addOrRemoveFriend } = fastify.di.cradle.userController
    const user = await addOrRemoveFriend(request, reply)
    reply.send({ data: user })
  })



  // enterRoomGreeting
  
  
  done()
}
