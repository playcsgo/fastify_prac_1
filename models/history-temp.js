module.exports = ({ mongoose }) => {
  const { Schema } = mongoose
  const historyTempSchema = new Schema({
    name: {type: String, required: true},
    history: [{type: String }],
    createdAt: {type: Date, default: Date.now}
  })

  return mongoose.model('fastify_history_temp', historyTempSchema)
}