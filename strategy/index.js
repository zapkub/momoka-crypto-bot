const arbitageStrategy = require('./arbitage.strategy')
const priceStrategy = require('./price.strategy')
const airport = require('./airports.strategy')

module.exports = [
  priceStrategy,
  arbitageStrategy.getArbitagePriceListStrategy,
  arbitageStrategy.getArbitagePriceStrategy,
  airport.metarStrategy
]
