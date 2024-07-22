// const mongoose = require('mongoose')
// const userModel = require('../models/user')

class worker1 {
  constructor({ rabbitMQ, mongoose, userModel }) {
    this.rabbitMQ = rabbitMQ
    this.userModel = userModel
    this.mongoose = mongoose
    this.consumeBet()
  }

  async consumeBet() {
    this.mongoose
    await this.rabbitMQ.consumeQueue('bet_que', this.processBet.bind(this))
    await this.rabbitMQ.consumeQueue('create_User', this.createUser.bind(this))  // 加上consume create_user的工作
    console.log('worker1 ready..')
  }

  async processBet(msg, ack) {
    const { betAmount, betNumber, id } = JSON.parse(msg.content.toString())
    const lottery = Number(Math.floor(Math.random() * 4) + 1)
    const user = await this.userModel.findById(id)
    if (!user) {
      console.log('worker1 return')
      return ('user Not Found')
    }
    if (Number(betNumber) === lottery) {
      user.found += betAmount * 3.8
    } else {
      user.found -= betAmount
    }
    await user.save()
    ack()

    console.log(`prcoessBet ${msg.fields.consumerTag} consume by worker1 with PID: ${process.pid}`)
  }

  async createUser(msg, ack) {
    const { name, email, password, found } = JSON.parse(msg.content.toString())
    const result = await this.userModel.create({
      name,
      email,
      password,
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
}

module.exports = worker1
