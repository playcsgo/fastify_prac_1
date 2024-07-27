module.exports = ({ mongoose }) => {
  const { Schema } = mongoose
  const historyLongSchema = new Schema({
    name: {type: String, required: true},
    history: [{type: String }],
    createdAt: {type: Date, default: Date.now}
  })

  return mongoose.model('fastify_history_long', historyLongSchema)
}