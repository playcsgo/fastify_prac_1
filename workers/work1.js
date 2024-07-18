// const mongoose = require('mongoose')
// const userModel = require('../models/user')

class work1 {
  constructor({ rabbitMQ, mongoose, userModel }) {
    this.rabbitMQ = rabbitMQ
    this.userModel = userModel
    this.mongoose = mongoose
    this.consumeBet()
  }

  async consumeBet() {
    this.mongoose
    await this.rabbitMQ.consumeQueue('bet_que', this.processBet.bind(this))
    console.log('work1 ready..')
  }

  async processBet(msg, ack) {
    const { betAmount, betNumber, id } = JSON.parse(msg.content.toString())
    const lottery = Number(Math.floor(Math.random() * 4) + 1)
    const user = await this.userModel.findById(id)
    if (Number(betNumber) === lottery) {
      user.found += betAmount * 3.8
    } else {
      user.found -= betAmount
    }
    await user.save()
    ack()

    console.log(`prcoessBet ${msg.fields.consumerTag} consume by work1 with PID: ${process.pid}`)
  }
}

module.exports = work1
