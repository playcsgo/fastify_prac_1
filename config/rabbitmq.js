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

  async sendToMQ(queueName, message, options = {}) {
    const channel = await this.getChannel()
    await channel.assertQueue(queueName, { durable: true }) //若改為 false, 需與controller一致, 15672也要重新設置(刪除)
    channel.sendToQueue(queueName, Buffer.from(message))
  }

  async consumeQueue(queueName, callback) {
    const channel = await this.getChannel()
    await channel.assertQueue(queueName, { durable: true }) //若有改 false, 需與controller一致 15672也要重新設置(刪除)
    channel.consume(queueName, (msg) => {
      callback(msg, () => channel.ack(msg))
    }, { noAck: false })
  }

  async publishMQ(exchangeName, exchangeType, routingKey, message, options = {}) {
    const channel = await this.getChannel()
    await channel.assertExchange(exchangeName, exchangeType, { durable: true })
    channel.publish(exchangeName, routingKey, Buffer.from(message), options)
  }

  async subscribe(exchange, queName) {
    const channel = await this.getChannel()
    await channel.assertExchange(exchange, 'fanout', { durable: true })
    await channel.assertQueue(queName, { durable: true })
    await channel.bindQueue(queName, exchange, '')
    
  }

  //end
}

module.exports = RabbitMQ


/*
// Direct Exchange
channel.publish('direct_exchange', 'routing_key', Buffer.from(message), options)

// Fanout Exchange
channel.publish('fanout_exchange', '', Buffer.from(message), options)

// Topic Exchange
channel.publish('topic_exchange', 'topic.routing.key', Buffer.from(message), options)

// Headers Exchange
channel.publish('headers_exchange', '', Buffer.from(message), {
  headers: {
    'header_key': 'header_value'
  }
})

 */