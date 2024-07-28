// routes/user.js
module.exports = function fibRoutes (fastify, opts, done) {
  //prefix fib

  // signle
  fastify.get('/single/:num', 
  async(request, reply) => {
    console.log('[fib_single]')
    const data = await fastify.di.cradle.fibController.singleThread(request, reply)
    reply.send(data)
  })
  
  // concurrent
  fastify.get('/concurrent/:num', 
  async(request, reply) => {
    console.log('[fib_single]')
    const data = await fastify.di.cradle.fibController.concurrentThread(request, reply)
    reply.send(data)
  })
  done()
}
