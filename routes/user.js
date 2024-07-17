// routes/user.js
module.exports = function userRoutes (fastify, opts, done) {
  fastify.post('/users', async(request, reply) => {
    const { createUser } = fastify.di.cradle.userController
    const createdUser = await createUser(request, reply)
    reply.send({ data: createdUser })
  })
  done()
}
