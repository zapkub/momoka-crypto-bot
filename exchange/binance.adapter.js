
// strategy will receive `action` type include
// payload, type
// strategy act like reducer in redux

const chalk = require('chalk')
const ExchangeAdapter = require('./adapter')
const API_ENDPOINT = 'https://api.binance.com/api/v1/trades'

class BinanceAdapter extends ExchangeAdapter {
  constructor () {
    super()
    this.API_ENDPOINT = API_ENDPOINT
    this.origin = 'binance'
  }

  async getPriceByCurrencyPrefix (currency, compare) {
    currency = currency.toUpperCase()
    compare = compare.toUpperCase()
    console.log(chalk.blue(`Binance Adapter: ${currency}${compare}`))
    const price = await this.fetchDataToCache(`${API_ENDPOINT}?symbol=${currency}${compare}&limit=${5}`)
    if (!price[0]) {
      throw new Error('Result not found ' + currency + compare)
    }
    return {
      origin: this.origin,
      primaryCurrency: compare,
      secondaryCurrency: currency,
      value: price[0].price
    }
  }
}

module.exports = BinanceAdapter
