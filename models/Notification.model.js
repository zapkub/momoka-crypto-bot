const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  ownerId: String,
  receptionId: String,
  actionType: String,
  payload: JSON,
  interval: Number
})

module.exports = mongoose.model('notification', NotificationSchema)
