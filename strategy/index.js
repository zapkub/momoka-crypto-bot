const actions = require('../parser/actions')
const BxAdapter = require('../adapter/exchange/bx.adapter')
const CryptowatAdapter = require('../adapter/exchange/cryptowat.adapter')
const arbitageStrategy = require('./arbitage.strategy')
const FixerAdapter = require('../adapter/exchange/fixer.adapter')

const bx = new BxAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()

function mappingOperator ({operation, value}, result) {
  switch (operation) {
    case 'MORE_THAN':
      return {
        text: 'มากกว่า',
        isMatch: result > value
      }
    case 'LESS_THAN':
      return {
        text: 'น้อยกว่า',
        isMatch: result < value
      }
  }
}
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
module.exports = [
  {
    test: /(^[a-zA-Z]{6}$)|(^[a-zA-Z]{3,4}\s[a-zA-Z]{3}$)/g,
    type: 'text',
    action: actions.GET_PRICE,
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
    conditionResolve: async (error, result) => {

    },
    messageReducer: async (error, result) => {
      if (!error) {
        return {
          type: 'text',
          text: `ราคา ${result.secondaryCurrency.toUpperCase()} ตอนนี้ ${result.value} ${result.primaryCurrency} ค่ะ`
        }
      }
      return {
        type: 'text',
        text: 'ไม่เจอข้อมูลดังกล่าว กรุณาลองใหม่ค่ะ'
      }
    }
  },
  {
    test: /^margin\s[a-zA-Z]{3,4}$/,
    action: actions.GET_ARBITAGE_PRICE,
    mapToPayload: (event) => {
      const words = event.text.split(' ')
      return {
        currency: words[1]
      }
    },
    resolve: async (action) => {
      const result = await arbitageStrategy.getArbitagePriceByCurrency(action.payload.currency)
      return result
    },
    conditionResolve: async (error, result, notification) => {
      const { payload, condition, _id } = notification
      const conditionResult = mappingOperator(condition, result.marginPercent)
      if (conditionResult.isMatch) {
        return {
          type: 'text',
          text:
            `แจ้งเตือน ${payload.currency} ${conditionResult.text} ${condition.value}%\n` +
            `ตอนนี้ ${result.marginPercent.toFixed(3)}%  แล้วค่ะ\n` +
            `(ref. ${_id})`
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
        text: `ราคา ${result.currency} เทียบ bx กับ bitfinex แพงกว่า ${result.marginPercent.toFixed(2)}% (${result.margin.toFixed(3)} THB)`
      }
    }
  },
  {
    test: /เทียบราคานอกหน่อย|compare/,
    action: actions.GET_ARBITAGE_PRICE_LIST,
    mapToPayload: (event) => {
      return {

      }
    },
    resolve: async (action) => {
      const result = await arbitageStrategy.getArbitagePriceByCurrencyList(['omg', 'btc', 'xrp', 'eth', 'dash'])
      return result
    },
    conditionResolve: async (error, result, notification) => {
      const { payload, condition, _id } = notification
      const conditionResult = mappingOperator(condition, result.value)
      if (conditionResult.isMatch) {
        return {
          type: 'text',
          text:
            `แจ้งเตือน ${payload.currency}${payload.compare} ${conditionResult.text} ${condition.value}  \n` +
            `ตอนนี้ ${result.value} แล้วค่ะ\n` +
            `(ref. ${_id})`
        }
      }
    },
    messageReducer: async (error, result) => {
      if (error) {
        return {
          type: 'text',
          text: `เกิดข้อผิดพลาดระหว่างเทียบราคา กรุณาลองใหม่ค่ะ`
        }
      }
      const worthResult = result.prices.map(price => `${price.currency} แพงกว่า ${-price.margin.toFixed(3)} THB (${-price.marginPercent.toFixed(2)}%)\n`)
      return {
        type: 'text',
        text: `ราคาตลาดเทียบระหว่าง bx กับ Bifinex\n` +
          `ค่าเงิน 1 USD ต่อ ${result.thbusd} THB\n` +
          worthResult.join('')

      }
    }
  }
]
