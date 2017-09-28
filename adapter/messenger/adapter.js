
const notificationService = require('../notification.service')
const ACTIONS = require('../../parser/actions')

const strategies = require('../../strategy')
const { UnimplementedError } = require('../../lib/Error')

class MessengerAdapter {
  constructor (config) {
    this.__provider = 'not defined'
    this.__config = config
    this.notificationList = []
    notificationService.registerWatcher(this.noticeUser.bind(this))
  }
  // create new user from messenger
  /**
   * user: {
   *  sourceType: 'LINE' || 'FACEBOOK_MESSENGER',
   *  sourceId: String
   *  name: String
   * }
   */
  async registerNewUser (user) {
    throw new UnimplementedError('registerNewUser')
  }
  async sendMessage (sourceId, messages) {
    throw new UnimplementedError('sendMessage')
  }

  async reduceNotification (notification) {
    const { type, actionType, payload } = notification
    // console.log('notification type: ' + type)
    // console.log('action type: ' + actionType)
    for (let strategy of strategies) {
      if (strategy.action === actionType) {
        const result = await strategy.resolve.bind(this)({ payload, type: actionType })
        const msg = await strategy.conditionResolve(undefined, result, notification, this.__config)
        msg.text = `${msg.text}\n` +
        `dismiss: ${this.__config.domain}/${this.__provider.toLowerCase()}/cancel_noti/${notification._id}`
        return msg
      }
    }
  }

  async noticeUser (notification) {
    if (notification.provider === this.__provider) {
      const result = await this.reduceNotification(notification)
      if (result) {
        await this.sendMessage(notification.receptionId, result)
      }
    }
  }
  // Response message generate here
  async getResponseMessage (action) {
    console.log('Messenger: get response with action')
    console.log(action)
    if (this.__provider === 'not defined') {
      throw new Error('Provider is not defined')
    }
    action.provider = this.__provider
    for (let strategy of strategies) {
      if (strategy.action === action.type) {
        const result = await strategy.resolve.bind(this)(action)
        const msg = await strategy.messageReducer(undefined, result)
        return msg
      }
    }
    switch (action.type) {
      case ACTIONS.LIST_ALERT: {
        const result = await notificationService.getNotificationFromReception(action.source.groupId || action.source.userId)
        if (!result.length) {
          return {
            type: 'text',
            text: 'ไม่มีการแจ้งเตือนไว้ค่ะ 🤐'
          }
        }
        const notiStrList = result.map((noti, index) => {
          return `${noti.command}: ${noti.condition.operation} ${noti.condition.value} (${noti._id})\n\n`
        })
        return {
          type: 'text',
          text: notiStrList.join('')
        }
      }
      case ACTIONS.CONDITION_ALERT:
      case ACTIONS.CANCEL_ALERT:
      case ACTIONS.INTERVAL: {
        console.log(action)
        const result = await notificationService.actionHandler(action)
        return {
          type: 'text',
          text: `${result.action} หมายเลข ${result._id}`
        }
      }
      case ACTIONS.AWAKE:
        return {
          type: 'text',
          text: 'ตื่นแล้วค่า'
        }
    }
  }
}

module.exports = MessengerAdapter
