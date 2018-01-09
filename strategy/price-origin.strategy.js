const BxAdapter = require('../exchange/bx.adapter')
const CryptowatAdapter = require('../exchange/cryptowat.adapter')
const FixerAdapter = require('../exchange/fixer.adapter')
const BittrexAdapter = require('../exchange/bittrex.adapter')
const BinanceAdapter = require('../exchange/binance.adapter')
const priceStrategy = require('./price.strategy')

const exchanges = [
  new BxAdapter(),
  new CryptowatAdapter(),
  new FixerAdapter(),
  new BittrexAdapter(),
  new BinanceAdapter()
]

module.exports = {
  test: /^[\w]+\s[a-zA-Z]{6,9}$/g,
  type: 'text',
  action: 'crypto/get-price-origin',

  mapToPayload: event => {
    const words = event.text.split(' ')
    const origin = words[0]
    const pair = words[1]
    let payload = {
      currency: pair.substring(0, 3).toLowerCase(),
      compare: pair.substring(3, 6).toLowerCase(),
      origin
    }

    const convertTo = pair.substring(6, 9).toLowerCase()
    if (convertTo) {
      payload.convertTo = convertTo
    }

    return payload
  },
  resolve: async action => {
    for (let exchange of exchanges) {
      if (exchange.origin === action.payload.origin) {
        const result = await exchange.getPriceByCurrencyPrefix(
          action.payload.currency,
          action.payload.compare
        )
        if (action.payload.convertTo) {
          console.log(action.payload)
          const convertResult = await priceStrategy.getPrice(
            result.primaryCurrency,
            action.payload.convertTo
          )
          result.primaryCurrency = action.payload.convertTo
          result.value = convertResult.value * result.value
        }
        return {
          ...result
        }
      }
    }
  },

  messageReducer: async (error, result) => {
    if (error) {
      return {
        type: 'text',
        text: 'เกิดข้อผิดพลาดบางอย่างค่ะ กรุณาลองใหม่'
      }
    }
    return {
      type: 'text',
      text: `ราคา ${result.secondaryCurrency.toUpperCase()} ${
        result.origin
      } ตอนนี้ ${result.value} ${result.primaryCurrency} ค่ะ`
    }
  }
}
