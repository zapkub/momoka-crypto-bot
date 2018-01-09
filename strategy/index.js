const arbitageStrategy = require('./arbitage.strategy')
const priceStrategy = require('./price.strategy')
const priceOrigin = require('./price-origin.strategy')
const pkg = require('../package.json')

module.exports = [
  arbitageStrategy.getArbitagePriceListStrategy,
  arbitageStrategy.getArbitagePriceStrategy,
  priceStrategy,
  priceOrigin,
  {
    test: /^version$/,
    mapToPayload: () => {},
    resolve: () => {},
    messageReducer: () => {
      return {
        type: 'text',
        text: 'โมโมกะตอนนี้เวอร์ชั่น ' + pkg.version + ' ค่ะ'
      }
    }
  }
]
