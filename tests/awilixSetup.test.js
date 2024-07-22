const { expect } = require('chai')
const fastify = require('fastify')()
const awilixPlugin = require('../awilixSetup')


describe('Awilix Container', () => {
  before(done => {
    fastify.register(awilixPlugin)
    fastify.ready(done)
  })

  it('resolve mongoose', () => {
    const mongoose = fastify.di.cradle.mongoose
    expect(mongoose).to.be.an('object')
  })

  it('resolve userModel', () => {
    const userModel = fastify.di.cradle.userModel
    expect(userModel).to.be.a('function')
  })

  it('resolve userController', () => {
    const userController = fastify.di.cradle.userController
    expect(userController).to.be.an('object')
  })

  it('resolve rabbitMQ', () => {
    const rabbitMQ = fastify.di.cradle.rabbitMQ
    expect(rabbitMQ).to.be.an('object')
  })

  it('resolve worker1', () => {
    const worker1 = fastify.di.cradle.worker1
    expect(worker1).to.be.an('object')
  })

  it('resolve worker2', () => {
    const worker2 = fastify.di.cradle.worker2
    expect(worker2).to.be.an('object')
  })

  it('resolve uuidv4', () => {
    const uuidv4 = fastify.di.cradle.uuidv4
    expect(uuidv4).to.be.a('function')
  })


  // end of describe
})