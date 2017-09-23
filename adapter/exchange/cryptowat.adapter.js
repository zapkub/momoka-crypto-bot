require('isomorphic-fetch')
const ExchangeAdapter = require('./adapter')

class CryptowatAdapter extends ExchangeAdapter {
  constructor () {
    super()
    this.API_ENDPOINT = `https://api.cryptowat.ch/`
  }

  async getPriceByCurrencyPrefix (currency, compare) {
    console.log('get price from Crytowat')
    console.log(`${currency}:${compare}`)
    currency = currency.toLowerCase()
    compare = compare.toLowerCase()
    const targetUrl = this.API_ENDPOINT + `markets/bitfinex/${currency}${compare}/price`
    const priceInfo = await this.fetchDataToCache(targetUrl)
    return {
      origin: 'cryptowat',
      primaryCurrency: compare,
      secondaryCurrency: currency,
      value: priceInfo.result.price
    }
  }
}

module.exports = CryptowatAdapter
