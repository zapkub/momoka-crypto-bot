const arbitageStrategy = require('../arbitage.strategy')

describe('arbitage test', () => {
  it('should get omg arbitage price from bx, bitfinex correctly', () => {
    arbitageStrategy.getArbitagePriceByCurrency('omg')
  })
})
