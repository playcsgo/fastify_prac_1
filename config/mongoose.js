require('dotenv').config()
const mongoose = require('mongoose')

function connectMongoose () {

  mongoose.connect(process.env.MONGODB_URI)
  const db = mongoose.connection

  db.on('error', (err) => {
    console.log(err)
  })
  db.once('open', () => {
    console.log('mongoDB connected.')
  })

  return mongoose
}

module.exports = connectMongoose
