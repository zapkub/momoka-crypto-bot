const bxStrategy = require('../bx.strategy')
require('isomorphic-fetch')

describe('Bx strategy test', () => {
  it('should getPriceInfo from bx api', async () => {
    const result = await bxStrategy.getPriceByCurrency('omg')
    expect(result).toEqual(expect.anything())
  })
})
