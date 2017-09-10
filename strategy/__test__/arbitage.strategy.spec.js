const arbitageStrategy = require('../arbitage.strategy')

describe('arbitage test', () => {
  it('should get omg arbitage price from bx, bitfinex correctly', async () => {
    const result = await arbitageStrategy.getArbitagePriceByCurrencyList(['omg'])
    expect(result).toEqual(expect.anything())
  })
})
