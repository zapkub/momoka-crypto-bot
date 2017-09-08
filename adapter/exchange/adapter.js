
const UnimplementedError = (methodName) => new Error(`UnimplementedError (${methodName})`)

require('isomorphic-fetch')
class ExchangeAdapter {
  constructor () {
    this.__endpoint = 'unknow endpoint'
  }
  set API_ENDPOINT (endpoint) {
    this.__endpoint = endpoint
  }
  get API_ENDPOINT () {
    return this.__endpoint
  }
  getPriceByCurrencyPrefix () {
    /**
     * return {
     *  primaryCurrency: number,
     *  secondaryCurrency: number,
     *  value: number
     * }
     */
    throw UnimplementedError('getPriceByCurrencyPrefix')
  }
  getPriceList () {
    throw UnimplementedError('getPriceLIst')
  }
}

module.exports = ExchangeAdapter
