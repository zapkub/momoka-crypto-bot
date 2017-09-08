const responseFactory = require('./response.factory')
const GET_ENDPOINT = (currency, compare) => `https://api.cryptowat.ch/markets/bitfinex/${currency}${compare}/price`
const ACTIONS = require('../parser/actions')

async function getPriceByCurrency (currency, compare) {
  try {
    const response = await global.fetch(GET_ENDPOINT(currency, compare), {
      method: 'GET'
    })
    const result = await response.json()
    return result.result.price
  } catch (e) {
    console.error(e)
    return null
  }
}
exports.strategy = async function ({type, payload}) {
  switch (type) {
    case ACTIONS.GET_PRICE:
      if (payload.from === 'cryptowat') {
        const price = await getPriceByCurrency(payload.currency, payload.compare)
        payload.price = price
        if (!price) { return null }
        return responseFactory.createResposeText({ type, payload })
      }
  }
}
