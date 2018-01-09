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
    if (compare === 'USD') {
      compare = 'USDT'
    }
    let price
    price = await this.fetchDataToCache(
      `${API_ENDPOINT}?symbol=${currency}${compare}&limit=${5}`
    )
    if (!price[0]) {
      const priceWithETH = await this.fetchDataToCache(
        `${API_ENDPOINT}?symbol=${currency}ETH&limit=${5}`
      )
      const priceWithETHUSDT = await this.fetchDataToCache(
        `${API_ENDPOINT}?symbol=ETHUSDT&limit=${5}`
      )
      if (!priceWithETH[0] || !priceWithETHUSDT[0]) {
        throw new Error('Result not found ' + currency + compare)
      }
      price = [
        {
          price: priceWithETH[0].price * priceWithETHUSDT[0].price
        }
      ]
    }

    if (!price[0]) {
      throw new Error('Result not found ' + currency + compare)
    }

    if (compare === 'USDT') {
      compare = 'USD'
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
