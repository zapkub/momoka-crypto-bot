const BxAdapter = require('../exchange/bx.adapter')
const CryptowatAdapter = require('../exchange/cryptowat.adapter')
const BinanceAdapter = require('../exchange/binance.adapter')
const BittrexAdapter = require('../exchange/bittrex.adapter')
const FixerAdapter = require('../exchange/fixer.adapter')
const { mappingOperator } = require('./helpers')

const bx = new BxAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()
const bt = new BittrexAdapter()
const bi = new BinanceAdapter()
async function getPrice (currency, compare, origin) {
  compare = compare.toLowerCase()
  try {
    if (compare === 'thb') {
      const result = await bx.getPriceByCurrencyPrefix(currency, compare)
      return result
    } else if (compare === 'usd') {
      const result = await cryptowat.getPriceByCurrencyPrefix(currency, compare)
      return result
    } else if (compare === 'btc') {
      const result = await bt.getPriceByCurrencyPrefix(currency, compare)
      return result
    } else if (compare === 'eth') {
      const result = await bi.getPriceByCurrencyPrefix(currency, compare)
      return result
    } else {
      return fixer.getPriceByCurrencyPrefix(currency, compare)
    }
  } catch (e) {
    console.error(`Momoka error price strategy: ${currency} ${compare} ${origin} `)

    console.error(e)
    throw e
  }
}

module.exports = {
  // internal method
  getPrice,
  test: /(^[a-zA-Z]{6}$)|(^[a-zA-Z]{3,4}\s[a-zA-Z]{3}$)|(^[a-zA-Z]{9}$)/g,
  type: 'text',
  action: 'crypto/get-price',
  mapToPayload: event => {
    const words = event.text.split(' ')
    if (words.length === 1) {
      const payload = {
        // Crypto prefix
        currency: words[0].substring(0, 3).toLowerCase(),
        // Cash prefix
        compare: words[0].substring(3, 6).toLowerCase()
        // Cash to convert prefix
      }
      const convertTo = words[0].substring(6, 9).toLowerCase()
      if (convertTo) {
        payload.convertTo = convertTo
      }

      return payload
    }
    return {
      currency: words[0].toLowerCase(),
      compare: words[1].toLowerCase()
    }
  },
  resolve: async action => {
    const { payload } = action
    try {
      const result = await getPrice(payload.currency, payload.compare)

      /**
       * Resolve for price across market
       * and convert to another currency price
       * example
       * - omgusdthb
       * this will get omgusd result and usdthb result
       * then combine together
       */
      if (payload.convertTo) {
        const convertFromCompareToConvertToResult = await getPrice(
          payload.compare,
          payload.convertTo
        )
        console.log(payload)
        return {
          ...result,
          value: result.value * convertFromCompareToConvertToResult.value,
          primaryCurrency: convertFromCompareToConvertToResult.primaryCurrency
        }
      }
      return result
    } catch (e) {
      throw e
    }
  },
  conditionResolve: async (error, result, notification) => {
    if (error) {
      return undefined
    }
    const { condition, command } = notification
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
      return [
        {
          type: 'text',
          text: `ราคา ${result.secondaryCurrency.toUpperCase()}(${
            result.origin
          }) ตอนนี้ ${result.value} ${result.primaryCurrency} ค่ะ`
        }
      ]
    }
    return {
      type: 'text',
      text: 'ไม่เจอข้อมูลดังกล่าว กรุณาลองใหม่ค่ะ'
    }
  }
}
