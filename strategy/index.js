const actions = require('../parser/actions')
const arbitageStrategy = require('./arbitage.strategy')
const priceStrategy = require('./price.strategy')

module.exports = [
  priceStrategy,
  arbitageStrategy.getArbitagePriceListStrategy,
  arbitageStrategy.getArbitagePriceStrategy
]
