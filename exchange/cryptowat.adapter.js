require('isomorphic-fetch')
const chalk = require('chalk')
const ExchangeAdapter = require('./adapter')

class CryptowatAdapter extends ExchangeAdapter {
  constructor () {
    super()
    this.API_ENDPOINT = `https://api.bitfinex.com/v2/`
  }

  async getPriceByCurrencyPrefix (currency, compare) {
    console.log(chalk.blue(`Bitfinex Adapter: ${currency}${compare}`))

    /**
     * Currency compare here
     * convert both to lowercase
     */
    currency = currency.toUpperCase()
    compare = compare.toUpperCase()
    // get infomation from bitfinex
    try {
      /**
       * Need to implement logic for crypto that
       * isn't listed in bitfinex by changing
       * this.API_ENDPOINT to another exchange
       * eg.
       * if(currency === 'xzc')
       */

      switch (currency) {
        case 'DASH':
          currency = 'DSH'
          break
      }
      const targetUrl =
        this.API_ENDPOINT + `ticker/t${currency}${compare}`
      const priceInfo = await this.fetchDataToCache(targetUrl)
      console.log(chalk.green(`Bitfinex Adapter: result ${priceInfo[6]}`))
      return {
        origin: 'finex',
        primaryCurrency: compare,
        secondaryCurrency: currency,
        value: priceInfo[6]
      }
    } catch (e) {
      // handle if error soon
    }
  }
}

module.exports = CryptowatAdapter
