// awilixSetup.js
const awilix = require('awilix')
const { createContainer, asFunction, asClass, asValue } = require('awilix')
const fp = require('fastify-plugin')
const connectMongo = require('./config/mongoose')
const UserModel = require('./models/user')
const historyLong = require('./models/history-long')
const historyTemp = require('./models/history-temp')
const UserController = require('./controllers/user-controllers')
const RabbitMQ = require('./config/rabbitmq')
const Worker1 = require('./workers/worker1')
const Worker2 = require('./workers/worker2')
const Worker3 = require('./workers/worker3')
const Worker4 = require('./workers/worker4')

const { v4: uuidv4 } = require('uuid')

// passport
const fastifyPassport = require('@fastify/passport')
const setPassport = require('./config/fastify-passport')
const bcryptjs = require('bcryptjs')
const JsonSchema = require('./json-schema/schema')
const middlewareAuth = require('./middleware/auth')
const jwt = require('jsonwebtoken')

// monitor
const middlewareMonitor = require('./middleware/minotor')

// 使用fast-plugin 製作成 plugin,
// 將所有的plugins 打包進container, 改名為 "di"
// 再"一次性"的於server.js fastify.register  
function awilixPlugin(fastify, opts, done) {

  const container = createContainer({
    // strict: true,
    injectionMode: awilix.InjectionMode.PROXY,
  })

  container.register({
    mongoose: asFunction(connectMongo).singleton(),
    userModel: asFunction(UserModel).scoped(),
    historyLong: asFunction(historyLong).scoped(),
    historyTemp: asFunction(historyTemp).scoped(),
    userController: asClass(UserController).scoped(),
    rabbitMQ: asClass(RabbitMQ).singleton(),
    worker1: asClass(Worker1).singleton(),
    worker2: asClass(Worker2).singleton(),
    worker3: asClass(Worker3).singleton(),
    worker4: asClass(Worker4).singleton(),
    uuidv4: asValue(uuidv4),

    // passport
    bcryptjs: asValue(bcryptjs),
    fastifyPassport: asValue(fastifyPassport),
    setPassport: asFunction(setPassport).singleton(),
    jwt: asValue(jwt),

    // json-schema
    jsonSchema: asValue(JsonSchema),

    //middleware
    middlewareAuth: asClass(middlewareAuth).scoped(),
    middlewareMonitor: asFunction(middlewareMonitor).scoped(),
  })

  // other Dependency


  // fastify decorate name as di
  fastify.decorate('di', container) 
  done()
}

module.exports = fp(awilixPlugin)
