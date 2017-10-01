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
  return __listeners.map(async listener => {
    await listener(action)
    console.log('==== end ===')
  })
}
async function watcher () {
  console.log(chalk.yellow('Notification: Start condition checking...'))
  const notifications = await Notification.read({})
  for (let notification of notifications) {
    console.log(`${(new Date()).toISOString()} id: ${notification._id}, owner: ${notification.ownerId}`)
    console.log(`command: ${notification.command}`)
    await Promise.all(noticeListeners(notification))
  }
  console.log(chalk.yellow('Notification: condition checking complete'))
}
// start notification loop
exports.startWatcher = () => {
  setInterval(watcher, NOTIFICATION_CHECK_INTERVAL)
  watcher()
}
exports.getNotificationFromReception = async function (receptionId) {
  const result = await Notification.read({ receptionId })
  return result
}
exports.actionHandler = async function ({ command, condition, source, provider, type, subType, interval, payload }) {
  console.log(chalk.yellow('Notification'))
  console.log(`Notification: request ${chalk.blue(type)}`)
  console.log(payload)
  if (type === ACTIONS.CONDITION_ALERT) {
    const ifNotificationExist = await Notification.read({ receptionId: source.groupId || source.userId, command, condition })
    console.log(ifNotificationExist)
    if (ifNotificationExist.length > 0) {
      return {
        action: '😐 ดูเหมือนจะมีการแจ้งเตือนนี้ไว้แล้วค่ะ',
        _id: ifNotificationExist[0]._id
      }
    } else {
      const notification = await Notification.create({
        ownerId: source.userId,
        receptionId: source.groupId || source.userId,
        type: type,
        command,
        actionType: subType,
        payload,
        provider,
        condition,
        interval
      })
      console.log(`Notification: create ${notification._id}`)
      notification.action = '🚨 เพิ่มการแจ้งเตือน'
      return notification
    }
  } else if (type === ACTIONS.CANCEL_ALERT) {
    await Notification.delete(payload.id)
    console.log(`Notification: delete ${payload.id}`)
    return {
      action: '🗑 เลิกการแจ้งเตือน',
      _id: payload.id
    }
  }
}
