const mongoose = require('mongoose')
const Schema = mongoose.Schema
const orderSchema = new Schema({
  room: {type: String, required: true},
  amount: {type: Number, required: true},
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
})

module.exports = mongoose.model('fastify_order', orderSchema)
