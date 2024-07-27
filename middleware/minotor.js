module.exports = ({ rabbitMQ }) => {
  return async (request, reply, done) => {
    try{
      console.log('[in monitor]')
      const url = request.raw.url
      const user = request.user
      const msg = JSON.stringify({ url, user })
      
      rabbitMQ.publishMQ(
        exchangeName = 'monitor_exchange',
        exchangeType = 'fanout',
        routingKey = '_routingKey',
        message = msg,
        { durable: true }
      )

      // done()  //會導致重複執行
    } catch(err) {
      throw new Error(err)
    }
    
  }
}
