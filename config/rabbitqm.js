// config/rabbitmq.js
const amqp = require('amqplib')

class RabbitMQ {
  constructor() {
    this.connection = null
    this.channel = null
    // bind
  }

  async getChannel() {
    if (!this.connection) {
      this.connection = await amqp.connect('amqp://localhost')
    }
    if (!this.channel) {
      this.channel = await this.connection.createChannel()
    }
    return this.channel
  }

  async sendToMQ(queueName, message) {
    const channel = await this.getChannel()
    await channel.assertQueue(queueName, { durable: true })
    channel.sendToQueue(queueName, Buffer.from(message))
  }

  async consumeQueue(queueName, callback) {
    const channel = await this.getChannel()
    await channel.assertQueue(queueName, { durable: true })
    channel.consume(queueName, (msg) => {
      callback(msg, () => channel.ack(msg))
    }, { noAck: true })
  }
}

module.exports = RabbitMQ
