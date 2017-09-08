require('isomorphic-fetch')
const BXAdapter = require('../adapter/exchange/bx.adapter')

const bx = new BXAdapter()
exports.getArbitagePriceByCurrency = async function (currency) {
  const bxResult = await bx.getPriceByCurrencyPrefix(currency, 'THB')
}
