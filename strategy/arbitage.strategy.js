require('isomorphic-fetch')
const BXAdapter = require('../adapter/exchange/bx.adapter')
const CryptowatAdapter = require('../adapter/exchange/cryptowat.adapter')
const FixerAdapter = require('../adapter/exchange/fixer.adapter')

const bx = new BXAdapter()
const cryptowat = new CryptowatAdapter()
const fixer = new FixerAdapter()

const interestedCurrency = [
  'omg', 'btc', 'xrp', 'eth'
]
exports.getArbitagePriceByCurrency = async function (currency) {
  const fixerResult = await fixer.getPriceByCurrencyPrefix('USD', 'THB')

  const promiseList = interestedCurrency.map(async currency => {
    const bxResult = await bx.getPriceByCurrencyPrefix(currency, 'THB')
    const cryptowatResult = await cryptowat.getPriceByCurrencyPrefix(currency, 'USD')
    const isNotWorthy = cryptowatResult.value * fixerResult.value > bxResult.value
    const margin = cryptowatResult.value * fixerResult.value - bxResult.value
    return {
      isWorthy: !isNotWorthy,
      currency,
      margin,
      prices: [
        cryptowatResult,
        bxResult
      ]
    }
  })

  const result = await Promise.all(promiseList)
  const worthResult = result.filter(price => price.isWorthy)
  console.log(worthResult)
}
