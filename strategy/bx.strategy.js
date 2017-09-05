
// strategy will receive `action` type include
// payload, type
// strategy act like reducer in redux
const ACTIONS = require('../parser/actions')

const API_ENDPOINT = 'https://bx.in.th/api/'
const getPriceList = exports.getPriceByCurrency = async function () {

}

const getPriceByCurrency = exports.getPriceByCurrency = async function (currency, compare) {
  const response = await global.fetch(API_ENDPOINT, {
    method: 'GET'
  })
  const priceInfo = await response.json()
  const result = Object.keys(priceInfo).map(key => {
    const price = priceInfo[key]
    if (price.secondary_currency.toLowerCase() === currency.toLowerCase()) {
      if (price.primary_currency.toLowerCase() === compare.toLowerCase()) {
        return price
      } else if (!compare) {
        if (price.primary_currency.toLowerCase() === 'thb') {
          return price
        }
      }
    } else {
      return null
    }
  }).filter(price => price)
  if (!result[0]) { return null }
  return result[0].last_price
}

exports.strategy = async function ({ type, payload }) {
  if (payload.from === 'bx') {
    switch (type) {
      case ACTIONS.GET_PRICE:
        const price = await getPriceByCurrency(payload.currency, payload.compare)
        if (!price) {
          return `${payload.currency} กับ ${payload.compare} ตอนนี้ไม่มีเลยค่า`
        }
        return `${payload.currency} จาก ${payload.from} ตอนนี้ราคา ${price} `
    }
  }
}
