const Binance = require('../binance.adapter')

const bi = new Binance()
describe('binace test', () => {
  it('should fetch data ETHBTC correctly', async () => {
    const result = await bi.getPriceByCurrencyPrefix('ETH', 'BTC')
    console.log(result)
  })
})
