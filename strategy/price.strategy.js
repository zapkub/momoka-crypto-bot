const BxAdapter = require('../adapter/exchange/bx.adapter')
const CryptowatAdapter = require('../adapter/exchange/cryptowat.adapter')
const FixerAdapter = require('../adapter/exchange/fixer.adapter')
const { mappingOperator } = require('./helpers')

const bx = new BxAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()
async function getPrice (currency, compare) {
  compare = compare.toLowerCase()
  try {
    if (compare === 'thb') {
      const result = await bx.getPriceByCurrencyPrefix(currency, compare)
      return result
    } else if (compare === 'usd') {
      const result = await cryptowat.getPriceByCurrencyPrefix(currency, compare)
      return result
    }
  } catch (e) {
    return fixer.getPriceByCurrencyPrefix(currency, compare)
  }
}

module.exports = {
  test: /(^[a-zA-Z]{6}$)|(^[a-zA-Z]{3,4}\s[a-zA-Z]{3}$)/g,
  type: 'text',
  action: 'crypto/get-price',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    if (words.length === 1) {
      return {
        currency: words[0].substring(0, 3).toLowerCase(),
        compare: words[0].substring(3, 6).toLowerCase()
      }
    }
    return {
      currency: words[0].toLowerCase(),
      compare: words[1].toLowerCase()
    }
  },
  resolve: async (action) => {
    const { payload } = action
    try {
      const result = await getPrice(payload.currency, payload.compare)
      return result
    } catch (e) {
      throw e
    }
  },
  conditionResolve: async (error, result, notification) => {
    if (error) {
      return undefined
    }
    const { payload, condition, _id, command } = notification
    const conditionResult = mappingOperator(condition, result.value)
    if (conditionResult.isMatch) {
      return {
        type: 'text',
        text:
          `แจ้งเตือน ${command} ${conditionResult.text} ${condition.value}\n` +
          `ตอนนี้ ${result.value} แล้วค่ะ 😌`
      }
    }
  },
  messageReducer: async (error, result) => {
    if (!error) {
      return [{
        type: 'text',
        text: `ราคา ${result.secondaryCurrency.toUpperCase()} ตอนนี้ ${result.value} ${result.primaryCurrency} ค่ะ`
      }, {
        type: 'text',
        text: 'น่าซื้ออยู่นะ'
      }]
    }
    return {
      type: 'text',
      text: 'ไม่เจอข้อมูลดังกล่าว กรุณาลองใหม่ค่ะ'
    }
  }
}
