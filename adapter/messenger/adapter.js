const BxAdapter = require('../exchange/bx.adapter')
const CryptowatAdapter = require('../exchange/cryptowat.adapter')
const arbitageStrategy = require('../../strategy/arbitage.strategy')
const actions = require('../../parser/actions')

class Notification {
  constructor ({ receptionId, action }) {
    this.__receptionId = receptionId
    this.__action = action
  }
}
class MessengerAdapter {
  constructor () {
    this.bx = new BxAdapter()
    this.cryptowat = new CryptowatAdapter()
    this.notificationList = []
  }
  getPrice (currency, compare) {
    compare = compare.toLowerCase()
    if (compare === 'thb') {
      return this.bx.getPriceByCurrencyPrefix(currency, compare)
    } else if (compare === 'usd') {
      return this.cryptowat.getPriceByCurrencyPrefix(currency, compare)
    }
  }

  // Response message generate here
  async getResponseMessage (action) {
    console.log('get response with action')
    console.log(action)
    switch (action.type) {
      case actions.GET_PRICE:
        try {
          const result = await this.getPrice(action.payload.currency, action.payload.compare)
          return {
            type: 'text',
            text: `ราคา ${result.secondaryCurrency.toUpperCase()} ตอนนี้ ${result.value} ${result.primaryCurrency} ค่ะ`
          }
        } catch (e) {
          return {
            type: 'text',
            text: 'ไม่สามารถเช็คราคาได้ในขณะนี้ กรุณาลองใหม่ค่ะ'
          }
        }
      case actions.GET_ARBITAGE_PRICE: {
        try {
          const result = await arbitageStrategy.getArbitagePriceByCurrencyList(['omg', 'btc', 'xrp', 'eth'])
          const worthResult = result.prices.map(price => `${price.currency} แพงกว่า ${-price.margin.toFixed(3)} THB (${-price.marginPercent.toFixed(2)}%)\n`)
          return {
            type: 'text',
            text: `ราคาตลาดเทียบระหว่าง bx กับ Bifinex\n` +
          `ค่าเงิน 1 USD ต่อ ${result.thbusd}  THB\n` +
          worthResult.join('')

          }
        } catch (e) {
          return {
            type: 'text',
            text: `เกิดข้อผิดพลาดระหว่างเทียบราคา กรุณาลองใหม่ค่ะ`
          }
        }
      }
      case actions.AWAKE:
        return {
          type: 'text',
          text: 'ตื่นแล้วค่า'
        }
    }
  }
}

module.exports = MessengerAdapter
