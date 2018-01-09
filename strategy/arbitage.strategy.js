require('isomorphic-fetch')
const BXAdapter = require('../exchange/bx.adapter')
const CryptowatAdapter = require('../exchange/cryptowat.adapter')
const priceOriginStrategy = require('./price-origin.strategy')

const FixerAdapter = require('../exchange/fixer.adapter')
const { mappingOperator } = require('./helpers')
const bx = new BXAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()

const getArbitagePriceByCurrency = (exports.getArbitagePriceByCurrency = async (
  currency,
  origin = 'finex'
) => {
  const fixerResult = await fixer.getPriceByCurrencyPrefix('USD', 'THB')

  let result = await bx.getPriceByCurrencyPrefix(currency, 'THB')
  let compareResult
  if (origin === 'binance') {
    /** implement compare binance */
  } else {
    compareResult = await cryptowat.getPriceByCurrencyPrefix(currency, 'USD')
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
  interestedCurrency,
  origin = 'finex'
) {
  const promiseList = interestedCurrency.map(currency =>
    getArbitagePriceByCurrency(currency, origin)
  )
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
    const interestedCurrencyList = ['omg', 'btc', 'xrp', 'eth', 'dash', 'bch']
    if (!action.payload.origin) {
      action.payload.origin = 'finex'
    }
    const result = await Promise.all(
      interestedCurrencyList.map(async currency => {
        const bx = await priceOriginStrategy.resolve({
          payload: {
            currency: currency,
            compare: 'thb',
            origin: 'bx'
          }
        })

        let compareExchangeResult
        switch (action.payload.origin) {
          case 'btrex': {
            if (currency !== 'btc' && currency !== 'bch') {
              compareExchangeResult = await priceOriginStrategy.resolve({
                payload: {
                  currency,
                  compare: 'btc',
                  convertTo: 'thb',
                  origin: 'btrex'
                }
              })
            }
            break
          }
          case 'finex': {
            compareExchangeResult = await priceOriginStrategy.resolve({
              payload: {
                currency,
                compare: 'usd',
                convertTo: 'thb',
                origin: 'finex'
              }
            })
            break
          }
          case 'binance': {
            compareExchangeResult = await priceOriginStrategy.resolve({
              payload: {
                currency,
                compare: 'usd',
                convertTo: 'thb',
                origin: 'binance'
              }
            })
            break
          }
        }

        return {
          bx,
          compareExchangeResult
        }
      })
    )
    return {
      result,
      origin: action.payload.origin
    }
  },
  conditionResolve: async (error, result, notification) => {},
  messageReducer: async (error, payload) => {
    const { result, origin } = payload
    if (error) {
      console.log(error)
      return {
        type: 'text',
        text: `เกิดข้อผิดพลาดระหว่างเทียบราคา กรุณาลองใหม่ค่ะ`
      }
    }
    // const worthResult = result.prices.map(
    //   price =>
    //     `${price.currency} แพงกว่า ${-price.margin.toFixed(
    //       3
    //     )} THB (${-price.marginPercent.toFixed(2)}%)\n`
    // )
    console.log(result[0])
    return {
      type: 'text',
      text: `เทียบราคาระหว่าง bx กับ ${origin} \n` + result
        .map(priceInfo => {
          console.log(priceInfo)
          if (priceInfo.compareExchangeResult) {
            const margin = priceInfo.bx.value - priceInfo.compareExchangeResult.value
            return `${priceInfo.bx.secondaryCurrency} แพงกว่า ${margin.toFixed(2)} (${(100 * margin / priceInfo.bx.value).toFixed(2)} % )\n`
          } else {
            return priceInfo.bx.secondaryCurrency + ' -\n'
          }
        })
        .join('')
    }
  }
}
