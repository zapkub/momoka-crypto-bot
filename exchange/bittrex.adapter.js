const ExchangeAdapter = require('./adapter')

class BittrexAdapter extends ExchangeAdapter {
  constructor () {
    super()
    this.ENDPOINT = 'https://bittrex.com/api/v1.1/public/getmarketsummaries'
  }
  async getPriceByCurrencyPrefix (currency, compare) {
    const markets = await this.fetchDataToCache(this.ENDPOINT)
    const targetName = `${compare.toUpperCase()}-${currency.toUpperCase()}`
    for (let price of markets.result) {
      if (
        price.MarketName === targetName
      ) {
        return {
          origin: 'btrex',
          primaryCurrency: compare,
          secondaryCurrency: currency,
          value: price.Last
        }
      }
    }
  }
}

module.exports = BittrexAdapter
