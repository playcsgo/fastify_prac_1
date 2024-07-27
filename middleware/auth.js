class middlewareAuth {
  constructor({ fastifyPassport }) {
    this.fastifyPassport = fastifyPassport
    this.apiAuthenticated = this.apiAuthenticated.bind(this)
  }

  apiAuthenticated (request, reply, done) {
    this.fastifyPassport.authenticate('jwt', { session: false }, (request, reply, err, user) => {
      if (err || !user) return reply.status(401).send({ status: 'error', message: 'unauthorized by api-auth' })
      request.user = user
      done()
    })(request, reply)
  }


  // end of class
}

module.exports = middlewareAuth
