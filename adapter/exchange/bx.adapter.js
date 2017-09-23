
// strategy will receive `action` type include
// payload, type
// strategy act like reducer in redux

const ExchangeAdapter = require('./adapter')
const API_ENDPOINT = 'https://bx.in.th/api/'

function getCurrencyFromPairingResult (pairingResult, currency, compare = 'thb') {
  const result = Object.keys(pairingResult).map(key => {
    const price = pairingResult[key]
    if (price.secondary_currency.toLowerCase() === currency.toLowerCase()) {
      if (price.primary_currency.toLowerCase() === compare.toLowerCase()) {
        return price
      }
    } else {
      return null
    }
  }).filter(price => price)
  if (!result[0]) { return null }
  return {
    secondaryCurrency: result[0].secondary_currency,
    primaryCurrency: result[0].primary_currency,
    value: result[0].last_price
  }
}
class BXAdapter extends ExchangeAdapter {
  constructor () {
    super()
    this.API_ENDPOINT = API_ENDPOINT
  }

  async getPriceByCurrencyPrefix (currency, compare) {
    currency = currency.toUpperCase()
    console.log('get price from BX')
    console.log(`${currency}:${compare}`)
    switch (currency) {
      case 'DASH':
        currency = 'DAS'
        break
    }
    const pairing = await this.fetchDataToCache(this.API_ENDPOINT)
    const price = getCurrencyFromPairingResult(pairing, currency, compare)
    return {
      origin: 'fixer',
      primaryCurrency: price.primaryCurrency,
      secondaryCurrency: currency,
      value: price.value
    }
  }
}

module.exports = BXAdapter
