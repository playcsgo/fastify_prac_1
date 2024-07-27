// const mongoose = require('mongoose')
// const userModel = require('../models/user')

class worker3 {
  constructor({ rabbitMQ, mongoose, userModel, bcryptjs, historyLong }) {
    this.rabbitMQ = rabbitMQ
    this.userModel = userModel
    this.mongoose = mongoose
    this.bcryptjs = bcryptjs
    this.historyLong = historyLong
    this.init()
  }

  async init() {
    this.mongoose

    // bet
    await this.rabbitMQ.consumeQueue('bet_que', this.processBet.bind(this))

    // 加上consume create_user的工作
    await this.rabbitMQ.consumeQueue('create_User', this.createUser.bind(this))  // 加上consume create_user的工作

    // monitor
    const subMonitorQueName = 'monitor_que_long'
    await this.rabbitMQ.subscribe('monitor_exchange', subMonitorQueName)
    await this.rabbitMQ.consumeQueue(subMonitorQueName, this.processMonitor.bind(this))

    console.log('worker3 ready..')
  }

  async processBet(msg, ack) {
    const { betAmount, betNumber, reqUser } = JSON.parse(msg.content.toString())
    const lottery = Number(Math.floor(Math.random() * 4) + 1)
    const user = await this.userModel.findById(reqUser._id.toString())
    if (!user) {
      ack()
      return ('user Not Found')
    }
    if (Number(betNumber) === lottery) {
      user.found += betAmount * 3.8
    } else {
      user.found -= betAmount
    }
    await user.save()
    ack()

    console.log(`prcoessBet ${msg.fields.deliveryTag} consume by worker3 with PID: ${process.pid}`)
  }

  async createUser(msg, ack) {
    const { name, email, password, found } = JSON.parse(msg.content.toString())
    const hashedPassword = await this.bcryptjs.hash(password, 10)
    const result = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      found: Number(found)
    })
    const createdUser = result.toObject() // for mongoDB object
    delete createdUser.password
    console.log('work1 createUser')
    ack()

    // reply to controller
    const replyMsg = JSON.stringify(createdUser)
    this.rabbitMQ.sendToMQ(
      msg.properties.replyTo,
      replyMsg,
      { correlationId: msg.properties.correlationId }
      )
  }

  async processMonitor(msg, ack) {
    const { user, url } = JSON.parse(msg.content.toString())
    const name = user.name
    const historyLong = await this.historyLong.findOne({ name })

    if (historyLong) {
      historyLong.history.push(url)
      await historyLong.save()
    } else {
      await this.historyLong.create({
        name,
        history: [url]
      })
    }
    ack()
    console.log(`processMonitor ${msg.fields.consumerTag} consume by worker3 with PID: ${process.pid}`)
  }
  
  //end 
}

module.exports = worker3
