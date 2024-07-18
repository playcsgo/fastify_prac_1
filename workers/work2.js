// work2
class work2 {
  constructor({ rabbitMQ, mongoose, userModel }) {
    this.rabbitMQ = rabbitMQ
    this.userModel = userModel
    this.mongoose = mongoose
    this.consumeBet()
  }

  async consumeBet() {
    this.mongoose
    await this.rabbitMQ.consumeQueue('bet_que', this.processBet.bind(this))
    console.log('work2 ready..')
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
    console.log(`prcoessBet ${msg.fields.deliveryTag} consume by work2 with PID: ${process.pid}`)
  }
}

module.exports = work2

/*

msg.fields: {
    consumerTag: 'amq.ctag-rHzowJQ6dirTPNCGteIpnw',
    deliveryTag: 1,
    redelivered: false,
    exchange: '',
    routingKey: 'bet_que'
*/