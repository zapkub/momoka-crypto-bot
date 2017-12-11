require('isomorphic-fetch')
const chalk = require('chalk')
const ExchangeAdapter = require('./adapter')

class CryptowatAdapter extends ExchangeAdapter {
  constructor () {
    super()
    this.API_ENDPOINT = `https://api.cryptowat.ch/`
  }

  async getPriceByCurrencyPrefix (currency, compare) {
    console.log(chalk.blue(`Cryptowat Adapter: ${currency}${compare}`))

    /**
     * Currency compare here
     * convert both to lowercase
     */
    currency = currency.toLowerCase()
    compare = compare.toLowerCase()
    // get infomation from bitfinex
    try {
      /**
       * Need to implement logic for crypto that
       * isn't listed in bitfinex by changing
       * this.API_ENDPOINT to another exchange
       * eg.
       * if(currency === 'xzc')
       */

      const targetUrl =
        this.API_ENDPOINT + `markets/bitfinex/${currency}${compare}/price`
      const priceInfo = await this.fetchDataToCache(targetUrl)
      console.log(chalk.green(`Cryptowat Adapter: ${priceInfo.result.price}`))
      return {
        origin: 'finex',
        primaryCurrency: compare,
        secondaryCurrency: currency,
        value: priceInfo.result.price
      }
    } catch (e) {
      // handle if error soon
    }
  }
}

module.exports = CryptowatAdapter
