const { workerData, parentPort } = require('worker_threads')


function fibonacci (n) {
  if (n < 1) return 0
  if (n <= 2) return 1
  return fibonacci(n-1) + fibonacci(n-2)
}

const result = fibonacci(workerData)
parentPort.postMessage(result)
