const price = require('../price.strategy')
const priceOrigin = require('../price-origin.strategy')

describe('Price startegy test', () => {
  it('should get price correctly', async () => {
    const result = await price.getPrice('xzc', 'btc')
    console.log(result)
  })
  it('should get price from origin bx correctly', async () => {
    const result = await priceOrigin.mapToPayload({
      text: 'bx omgthb'
    })
    const priceInfo = await priceOrigin.resolve({
      type: 'TEXT',
      payload: result
    })
    expect(priceInfo.origin).toEqual('bx')
  })
  it('should get price from origin binance correctly', async () => {
    const result = await priceOrigin.mapToPayload({
      text: 'binance omgeththb'
    })
    expect(result.compare).toEqual('eth')
    expect(result.convertTo).toEqual('thb')
    const priceInfo = await priceOrigin.resolve({
      type: 'TEXT',
      payload: result
    })
    expect(priceInfo.origin).toEqual('binance')
  })
})
