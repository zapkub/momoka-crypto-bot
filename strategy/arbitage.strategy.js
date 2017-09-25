require('isomorphic-fetch')
const BXAdapter = require('../adapter/exchange/bx.adapter')
const CryptowatAdapter = require('../adapter/exchange/cryptowat.adapter')
const FixerAdapter = require('../adapter/exchange/fixer.adapter')

const bx = new BXAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()

// const interestedCurrency = [
//   'omg', 'btc', 'xrp', 'eth'
// ]
const getArbitagePriceByCurrency = exports.getArbitagePriceByCurrency = async currency => {
  const fixerResult = await fixer.getPriceByCurrencyPrefix('USD', 'THB')
  const bxResult = await bx.getPriceByCurrencyPrefix(currency, 'THB')
  const cryptowatResult = await cryptowat.getPriceByCurrencyPrefix(currency, 'USD')

  const isNotWorthy = cryptowatResult.value * fixerResult.value > bxResult.value
  const margin = cryptowatResult.value * fixerResult.value - bxResult.value
  const marginPercent = (100 * margin) / (cryptowatResult.value * fixerResult.value)
  return {
    thbusd: fixerResult.value,
    isWorthy: !isNotWorthy,
    currency,
    margin,
    marginPercent,
    prices: [
      cryptowatResult,
      bxResult
    ]
  }
}
exports.getArbitagePriceByCurrencyList = async function (interestedCurrency) {
  const promiseList = interestedCurrency.map(getArbitagePriceByCurrency)
  const fixerResult = await fixer.getPriceByCurrencyPrefix('USD', 'THB')

  const result = await Promise.all(promiseList)
  return {
    prices: result,
    thbusd: fixerResult.value
  }
}
