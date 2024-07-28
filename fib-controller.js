// controllers/user-controller with 6 RabbitMQ patterns
class FibController {
  constructor() {
    this.fibonacci = this.fibonacci.bind(this)
    this.doFIb = this.doFIb.bind(this)
    this.doFibByWorker = this.doFibByWorker.bind(this)
    // this.singleThread = this.singleThread.bind(this)
  }

  fibonacci(n) {
    if (n < 1) return 0
    if (n <= 2) return 1
    return this.fibonacci(n-1) + this.fibonacci(n-2)
  }

  async doFIb (iterations) {
    return new Promise(resolve => {
      const start = Date.now()
      const result = this.fibonacci(iterations)
      const calculationTime = `${Date.now() - start}ms`
      console.log(calculationTime)
      resolve([result, calculationTime])
    })
  }

  async singleThread(request, reply) {
    try {
      const number = Number(request.params.num)
      console.log('[number]:', number)
      const startTime = Date.now()
      const result = await Promise.all([
        this.doFIb(number),
        this.doFIb(number),
        this.doFIb(number),
        this.doFIb(number),
        this.doFIb(number),
      ])
      
      const totalSpendTime = Date.now() - startTime
      const message = `All doFibs done in ${totalSpendTime} ms`
      console.log(`done in ${totalSpendTime}ms`)
      return ({
        number,
        result,
        message
      })
    } catch(err) {
      throw new Error(err)
    }
  }

  async doFibByWorker (iterations) {
    const { Worker } = require('worker_threads')

    return new Promise((resolve, reject) => {
      const start = Date.now()
      const worker = new Worker('./worker3.js', {
        workerData: iterations
      })

      worker.once('message', result => {
        console.log(`worker_thread ID [${ worker.threadId }]: result: ${result}  done in ${Date.now() - start}ms`)
        resolve(result)
      })

      worker.once('error', err => reject(err))
    })
  }
  
  async concurrentThread (request, reply) {
    try {
      const number = Number(request.params.num)
      console.log('[number_concurrent]:', number)
      const startTime = Date.now()
      const result = await Promise.all([
        this.doFibByWorker(number),
        this.doFibByWorker(number),
        this.doFibByWorker(number),
        this.doFibByWorker(number),
        this.doFibByWorker(number),
      ])
      
      const totalSpendTime = Date.now() - startTime
      const message = `All doFibs done in ${totalSpendTime} ms`

      console.log(`done in ${totalSpendTime}ms`)
      return ({
        number,
        result,
        message
      })
    } catch(err) {
      console.log(err)
      throw new Error(err)
    }

  }

}

module.exports = FibController
