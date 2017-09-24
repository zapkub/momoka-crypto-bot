const BxAdapter = require('../exchange/bx.adapter')
const CryptowatAdapter = require('../exchange/cryptowat.adapter')
const arbitageStrategy = require('../../strategy/arbitage.strategy')
const notificationService = require('../../strategy/notification.service')
const FixerAdapter = require('../../adapter/exchange/fixer.adapter')
const ACTIONS = require('../../parser/actions')

const { UnimplementedError } = require('../../lib/Error')

function mappingOperator ({operation, value}, result) {
  switch (operation) {
    case 'MORE_THAN':
      return {
        text: 'มากกว่า',
        result: result > value
      }
    case 'LESS_THAN':
      return {
        text: 'น้อยกว่า',
        result: result < value
      }
  }
}

class MessengerAdapter {
  constructor () {
    this.bx = new BxAdapter()
    this.cryptowat = new CryptowatAdapter()
    this.fixer = new FixerAdapter()
    this.__provider = 'not defined'
    this.notificationList = []
    notificationService.registerWatcher(this.noticeUser.bind(this))
  }
  async getPrice (currency, compare) {
    compare = compare.toLowerCase()
    try {
      if (compare === 'thb') {
        const result = await this.bx.getPriceByCurrencyPrefix(currency, compare)
        return result
      } else if (compare === 'usd') {
        const result = await this.cryptowat.getPriceByCurrencyPrefix(currency, compare)
        return result
      }
    } catch (e) {
      return this.fixer.getPriceByCurrencyPrefix(currency, compare)
    }
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

  async reduceNotification ({ type, actionType, payload, condition, _id }) {
    switch (actionType) {
      case ACTIONS.GET_PRICE: {
        const result = await this.getPrice(payload.currency, payload.compare)
        const conditionResult = mappingOperator(condition, result.value)
        if (conditionResult.result) {
          return {
            type: 'text',
            text: `แจ้งเตือนราคา ${payload.currency}${payload.compare} (${result.value}) ตอนนี้ ${conditionResult.text} ${condition.value} แล้วค่ะ (ref. ${_id})`
          }
        }
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
    switch (action.type) {
      case ACTIONS.GET_PRICE:
        try {
          const result = await this.getPrice(action.payload.currency, action.payload.compare)
          return {
            type: 'text',
            text: `ราคา ${result.secondaryCurrency.toUpperCase()} ตอนนี้ ${result.value} ${result.primaryCurrency} ค่ะ`
          }
        } catch (e) {
          return {
            type: 'text',
            text: 'ไม่เจอข้อมูลดังกล่าว กรุณาลองใหม่ค่ะ'
          }
        }
      case ACTIONS.GET_ARBITAGE_PRICE: {
        try {
          const result = await arbitageStrategy.getArbitagePriceByCurrencyList(['omg', 'btc', 'xrp', 'eth', 'dash'])
          const worthResult = result.prices.map(price => `${price.currency} แพงกว่า ${-price.margin.toFixed(3)} THB (${-price.marginPercent.toFixed(2)}%)\n`)
          return {
            type: 'text',
            text: `ราคาตลาดเทียบระหว่าง bx กับ Bifinex\n` +
          `ค่าเงิน 1 USD ต่อ ${result.thbusd}  THB\n` +
          worthResult.join('')

          }
        } catch (e) {
          console.error(e)
          return {
            type: 'text',
            text: `เกิดข้อผิดพลาดระหว่างเทียบราคา กรุณาลองใหม่ค่ะ`
          }
        }
      }
      case ACTIONS.CONDITION_ALERT:
      case ACTIONS.CANCEL_ALERT:
      case ACTIONS.INTERVAL: {
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
