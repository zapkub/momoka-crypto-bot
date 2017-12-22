require('isomorphic-fetch')
const BXAdapter = require('../exchange/bx.adapter')
const CryptowatAdapter = require('../exchange/cryptowat.adapter')
const FixerAdapter = require('../exchange/fixer.adapter')
const { mappingOperator } = require('./helpers')
const bx = new BXAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()

const getArbitagePriceByCurrency = (exports.getArbitagePriceByCurrency = async currency => {
  const fixerResult = await fixer.getPriceByCurrencyPrefix('USD', 'THB')
  const bxResult = await bx.getPriceByCurrencyPrefix(currency, 'THB')
  const cryptowatResult = await cryptowat.getPriceByCurrencyPrefix(
    currency,
    'USD'
  )
  try {
    const isNotWorthy =
      cryptowatResult.value * fixerResult.value > bxResult.value
    const margin = cryptowatResult.value * fixerResult.value - bxResult.value
    const marginPercent =
      100 * margin / (cryptowatResult.value * fixerResult.value)
    return {
      thbusd: fixerResult.value,
      isWorthy: !isNotWorthy,
      currency,
      margin,
      marginPercent,
      prices: [cryptowatResult, bxResult]
    }
  } catch (e) {
    console.error(e)
    return {
      thbusd: fixerResult.value,
      currency,
      prices: [cryptowatResult, bxResult]
    }
  }
})
const getArbitagePriceByCurrencyList = (exports.getArbitagePriceByCurrencyList = async function (
  interestedCurrency
) {
  const promiseList = interestedCurrency.map(getArbitagePriceByCurrency)
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
  test: /เทียบราคานอกหน่อย|compare/,
  action: 'crypto/get-arbitage-price-list',
  mapToPayload: event => {
    return {}
  },
  resolve: async action => {
    const result = await getArbitagePriceByCurrencyList([
      'omg',
      'btc',
      'xrp',
      'eth',
      'dash',
      'bch'
    ])
    return result
  },
  conditionResolve: async (error, result, notification) => {
    try {
      const { payload, condition, _id } = notification
      const conditionResult = mappingOperator(condition, result.value)
      if (conditionResult.isMatch) {
        return {
          type: 'text',
          text:
            `แจ้งเตือน ${payload.currency}${payload.compare} ${
              conditionResult.text
            } ${condition.value}  \n` + `ตอนนี้ ${result.value} แล้วค่ะ\n`
        }
      }
    } catch (e) {}
  },
  messageReducer: async (error, result) => {
    if (error) {
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
