// routes/user.js
module.exports = function userRoutes (fastify, opts, done) {
  
  fastify.post('/users', async(request, reply) => {
    const { createUser } = fastify.di.cradle.userController
    const createdUser = await createUser(request, reply)
    reply.send({ data: createdUser })
  })

  fastify.get('/:id', async(request, reply) => {
    const { getUser } = fastify.di.cradle.userController
    const user = await getUser(request, reply)
    reply.send({ data: user })
  })

  fastify.post('/betonetofour', async(request, reply) => {
    const { betOnetoFour } = fastify.di.cradle.userController
    const user = await betOnetoFour(request, reply)
    reply.send({ data: user })
  })

  fastify.post('/friends/:friendId', async(request, reply) => {
    const { addOrRemoveFriend } = fastify.di.cradle.userController
    const user = await addOrRemoveFriend(request, reply)
    reply.send({ data: user })
  })
  
  done()
}
