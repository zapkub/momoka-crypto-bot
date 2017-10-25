const arbitageStrategy = require('./arbitage.strategy')
const priceStrategy = require('./price.strategy')
const airportsStrategy = require('./airports.strategy')

module.exports = [
  priceStrategy,
  arbitageStrategy.getArbitagePriceListStrategy,
  arbitageStrategy.getArbitagePriceStrategy,
  airportsStrategy.abstractStrategy
]
