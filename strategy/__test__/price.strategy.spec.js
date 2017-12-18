const price = require('../price.strategy')
describe('Price startegy test', () => {
  it('should get price correctly', async () => {
    const result = await price.getPrice('xzc', 'btc')
    console.log(result)
  })
})
