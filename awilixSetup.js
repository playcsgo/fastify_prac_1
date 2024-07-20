// awilixSetup.js
const awilix = require('awilix')
const { createContainer, asFunction, asClass, asValue } = require('awilix')
const fp = require('fastify-plugin')
const connectMongo = require('./config/mongoose')
const UserModel = require('./models/user')
const UserController = require('./controllers/user-controllers')
const RabbitMQ = require('./config/rabbitmq')
const Worker1 = require('./workers/worker1')
const Worker2 = require('./workers/worker2')
const userRoutes = require('./routes/user')

const JsonSchema = require('./json-schema/schema')


// 使用fast-plugin 製作成 plugin, 
// 再去server.js fastify.register
function awilixPlugin(fastify, opts, done) {

  const container = createContainer({
    // strict: true,
    injectionMode: awilix.InjectionMode.PROXY,
  })

  container.register({
    mongoose: asFunction(connectMongo).singleton(),
    userModel: asFunction(UserModel).scoped(),
    userController: asClass(UserController).scoped(),
    rabbitMQ: asClass(RabbitMQ).singleton(),
    worker1: asClass(Worker1).singleton(),
    worker2: asClass(Worker2).singleton(),
    userRoutes: asFunction(userRoutes).singleton(),

    // json-schema
    createUserSchema: asValue(JsonSchema.createUserSchema)
  })

  // other Dependency


  // fastify decorate name as di
  fastify.decorate('di', container) 
  done()
}

module.exports = fp(awilixPlugin)
