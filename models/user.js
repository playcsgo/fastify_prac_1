module.exports = ({ mongoose }) => {
  const { Schema } = mongoose
  const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    found: { type: Number, required:true, default: 2000 },
    roomNumber: { type: Number, required:true, default: 0 },
    friends: [{type: { type: mongoose.Types.ObjectId,
      ref: 'User' } }],
    createdAt: {type: Date, default: Date.now}
  })

  return mongoose.model('fastify_user', userSchema)
}

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const userSchema = new Schema({
//   name: {type: String, required: true},
//   email: {type: String, required: true},
//   password: {type: String, required: true},
//   found: { type: Number, required:true, default: 2000 },
//   room: { type: Number, required:true, default: null },
//   friends: [{type: { type: mongoose.Types.ObjectId,
//     ref: 'User' } }],
//   createdAt: {type: Date, default: Date.now}
// })

// module.exports = mongoose.model('fastify_user', userSchema)
