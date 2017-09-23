
const UnimplementedError = (methodName) => new Error(`UnimplementedError (${methodName})`)
const CACHE_PURGE_INTERVAL = 1000 * 20
const chalk = require('chalk')
require('isomorphic-fetch')

let cache = {

}

function purgeCache () {
    // clear in memory cache
  console.log(chalk.yellow('PURGING CACHE...'))
  cache = {

  }
  console.log(chalk.green('cache is clear'))
}
setInterval(purgeCache, CACHE_PURGE_INTERVAL)
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

  async fetchDataToCache (target) {
    if (!cache[target]) {
      console.log(chalk.yellow('Data not found, fetching: ' + target))
      const response = await global.fetch(target)
      const result = await response.json()
      cache[target] = result
    }
    return cache[target]
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
