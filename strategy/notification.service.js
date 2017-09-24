const chalk = require('chalk')
const Models = require('../models')
const Notification = Models('notification')
const ACTIONS = require('../parser/actions')

const NOTIFICATION_CHECK_INTERVAL = 10000

let __listeners = []
exports.registerWatcher = function (callback) {
  __listeners.push(callback)
}

exports.removeWatcher = function (callback) {
  __listeners = __listeners.filter(cb => cb !== callback)
}

function noticeListeners (action) {
  __listeners.forEach(listener => {
    listener(action)
  })
}
async function watcher () {
  console.log(chalk.yellow('Notification: Start condition checking...'))
  const notifications = await Notification.read({})
  for (let notification of notifications) {
    console.log(`id: ${notification._id}, owner: ${notification.ownerId}`)
    noticeListeners(notification)
  }
  console.log(chalk.yellow('Notification: condition checking complete'))
}
// start notification loop
setInterval(watcher, NOTIFICATION_CHECK_INTERVAL)
watcher()

exports.actionHandler = async function ({ condition, source, provider, type, subType, interval, payload }) {
  console.log(chalk.yellow('Notification'))
  console.log(`Notification: request ${chalk.blue(type)}`)
  console.log(payload)
  if (type === ACTIONS.CONDITION_ALERT) {
    const notification = await Notification.create({
      ownerId: source.userId || source.groupId,
      receptionId: source.userId || source.groupId,
      type: type,
      actionType: subType,
      payload,
      provider,
      condition,
      interval
    })
    console.log(`Notification: create ${notification._id}`)
    notification.action = 'เพิ่มการแจ้งเตือน'
    return notification
  } else if (type === ACTIONS.CANCEL_ALERT) {
    const result = await Notification.delete(payload.id)
    console.log(`Notification: delete ${payload.id}`)
    return {
      action: 'เลิกการแจ้งเตือน',
      _id: payload.id
    }
  }
}
