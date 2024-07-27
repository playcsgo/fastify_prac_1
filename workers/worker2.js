// work2
// const { parentPort } = require('worker_threads')

class worker2 {
  constructor({ rabbitMQ, mongoose, userModel, historyTemp }) {
    this.rabbitMQ = rabbitMQ
    this.userModel = userModel
    this.mongoose = mongoose
    this.historyTemp = historyTemp
    this.init()
  }

  async init() {
    this.mongoose
    // bet
    await this.rabbitMQ.consumeQueue('bet_que', this.processBet.bind(this))

    // monitor
    const subMonitorQueName = 'monitor_que_temp'
    await this.rabbitMQ.subscribe('monitor_exchange', subMonitorQueName)
    await this.rabbitMQ.consumeQueue(subMonitorQueName, this.processMonitor.bind(this))

    console.log('worker2 ready..')
  }

  async processBet(msg, ack) {
    const { betAmount, betNumber, reqUser } = JSON.parse(msg.content.toString())
    const lottery = Number(Math.floor(Math.random() * 4) + 1)
    const user = await this.userModel.findById(reqUser._id.toString())
    if (!user) {
      ack()
      throw new Error('user Not Found')
    }
    if (Number(betNumber) === lottery) {
      user.found += betAmount * 3.8
    } else {
      user.found -= betAmount
    }
    await user.save()
    ack()
    console.log(`prcoessBet ${msg.fields.consumerTag} consume by worker2 with PID: ${process.pid}`)
  }

  async processMonitor(msg, ack) {
    const { user, url } = JSON.parse(msg.content.toString())
    const name = user.name
    const historyTemp = await this.historyTemp.findOne({ name })

    if (historyTemp) {
      historyTemp.history.push(url)
      await historyTemp.save()
    } else {
      await this.historyTemp.create({
        name,
        history: [url]
      })
    }
    ack()
    console.log(`processMonitor ${msg.fields.consumerTag} consume by worker2 with PID: ${process.pid}`)
  }
  //end 
}

module.exports = worker2

/*

msg.fields: {
    consumerTag: 'amq.ctag-rHzowJQ6dirTPNCGteIpnw',
    deliveryTag: 1,
    redelivered: false,
    exchange: '',
    routingKey: 'bet_que'
*/