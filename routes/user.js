// routes/user.js
module.exports = function userRoutes (fastify, opts, done, userController) {
  
  // because routes register with prefix '/v1'
  // POST '/users' should be POST '/v1/users' while requesting

  // create user
  fastify.post('/users',
    { schema: fastify.di.cradle.jsonSchema.postUsers }, 
    (request, reply) => { fastify.di.cradle.userController.createUser(request, reply) }
    )

  // getUser
  fastify.get('/:id', async(request, reply) => {
    const { getUser } = fastify.di.cradle.userController
    const user = await getUser(request, reply)
    reply.send({ data: user })
  })

  // user bet with found
  fastify.post('/betonetofour', async(request, reply) => {
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
  
  done()
}
