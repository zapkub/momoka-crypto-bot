require('isomorphic-fetch')
const BXAdapter = require('../exchange/bx.adapter')
const CryptowatAdapter = require('../exchange/cryptowat.adapter')
const BinanceAdapter = require('../exchange/binance.adapter')
const priceStrategy = require('./price.strategy')

const FixerAdapter = require('../exchange/fixer.adapter')
const { mappingOperator } = require('./helpers')
const bx = new BXAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()

const getArbitagePriceByCurrency = (exports.getArbitagePriceByCurrency = async (currency, origin = 'finex') => {
  const fixerResult = await fixer.getPriceByCurrencyPrefix('USD', 'THB')

  let result = await bx.getPriceByCurrencyPrefix(currency, 'THB')
  let compareResult
  if (origin === 'binance') {
    /** implement compare binance */
  } else {
    compareResult = await cryptowat.getPriceByCurrencyPrefix(
    currency,
    'USD'
  )
  }

  try {
    const isNotWorthy = compareResult.value * fixerResult.value > result.value
    const margin = compareResult.value * fixerResult.value - result.value
    const marginPercent =
      100 * margin / (compareResult.value * fixerResult.value)
    return {
      thbusd: fixerResult.value,
      isWorthy: !isNotWorthy,
      currency,
      margin,
      marginPercent,
      prices: [compareResult, result]
    }
  } catch (e) {
    console.error(e)
    return {
      thbusd: fixerResult.value,
      currency,
      prices: [compareResult, result]
    }
  }
})
const getArbitagePriceByCurrencyList = (exports.getArbitagePriceByCurrencyList = async function (
  interestedCurrency, origin = 'finex'
) {
  const promiseList = interestedCurrency.map((currency) => getArbitagePriceByCurrency(currency, origin))
  const fixerResult = await fixer.getPriceByCurrencyPrefix('USD', 'THB')

  const result = await Promise.all(promiseList)
  return {
    prices: result,
    thbusd: fixerResult.value
  }
})

exports.getArbitagePriceStrategy = {
  test: /^margin\s[a-zA-Z]{3,4}$/,
  action: 'crypto/get-arbitage-price',
  mapToPayload: event => {
    const words = event.text.split(' ')
    return {
      currency: words[1]
    }
  },
  resolve: async action => {
    const result = await getArbitagePriceByCurrency(action.payload.currency)
    return result
  },
  conditionResolve: async (error, result, notification) => {
    if (error) return
    const { payload, condition } = notification
    const conditionResult = mappingOperator(condition, result.marginPercent)
    if (conditionResult.isMatch) {
      return {
        type: 'text',
        text:
          `แจ้งเตือน ${payload.currency} ${conditionResult.text} ${
            condition.value
          }%\n` + `ตอนนี้ ${result.marginPercent.toFixed(3)}%  แล้วค่ะ\n`
      }
    }
  },
  messageReducer: async (error, result) => {
    if (error) {
      return {
        type: 'text',
        text: 'เกิดข้อผิดพลาดระหว่างดึงข้อมูล กรุณาลองใหม่ค่ะ'
      }
    }
    return {
      type: 'text',
      text: `bitfinex ราคา ${
        result.currency
      } แพงกว่า ${result.marginPercent.toFixed(2)}% (${result.margin.toFixed(
        3
      )} THB)`
    }
  }
}

exports.getArbitagePriceListStrategy = {
  test: /เทียบราคานอกหน่อย|compare|^compare\s[\w]+$/,
  action: 'crypto/get-arbitage-price-list',
  mapToPayload: event => {
    const word = event.text.split(' ')
    if (word[1]) {
      return {
        origin: word[1]
      }
    }
    return {}
  },
  resolve: async action => {
    let origin = 'finex'
    if (action.payload.origin) {
      origin = action.payload.origin
    }
    const result = await getArbitagePriceByCurrencyList([
      'omg',
      'btc',
      'xrp',
      'eth',
      'dash',
      'bch'
    ], origin)
    return result
  },
  conditionResolve: async (error, result, notification) => {

  },
  messageReducer: async (error, result) => {
    if (error) {
      console.log(error)
      return {
        type: 'text',
        text: `เกิดข้อผิดพลาดระหว่างเทียบราคา กรุณาลองใหม่ค่ะ`
      }
    }
    const worthResult = result.prices.map(
      price =>
        `${price.currency} แพงกว่า ${-price.margin.toFixed(
          3
        )} THB (${-price.marginPercent.toFixed(2)}%)\n`
    )
    return {
      type: 'text',
      text:
        `ราคาตลาดเทียบระหว่าง bx กับ Bifinex\n` +
        `ค่าเงิน 1 USD ต่อ ${result.thbusd} THB\n` +
        worthResult.join('')
    }
  }
}
