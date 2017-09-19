const mongoose = require('mongoose')

const CommandSchema = new mongoose.Schema({
  ownerId: String,
  command: String,
  action: String
})

module.exports = mongoose.model('command', CommandSchema)
