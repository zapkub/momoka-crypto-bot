const Bittrex = require('../bittrex.adapter')

describe('Bittrex test', () => {
  it('should get zxc price correctly', async () => {
    const bt = new Bittrex()
    const result = await bt.getPriceByCurrencyPrefix('xzc', 'btc')
    expect(result).toEqual(expect.anything())
  })
})
