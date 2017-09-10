const ACTIONS = require('../parser/actions')

const latestPrice = {

}

function getEmojiByPrice (latest, current) {
  if (latest > current) {
    return '😢 '
  } else if (latest < current) {
    return '😆 '
  } else {
    return '😕 '
  }
}

exports.createResposeText = function ({type, payload}) {
  switch (type) {
    case ACTIONS.GET_PRICE:
      const result = {
        text: `${getEmojiByPrice(latestPrice[payload.currency], payload.price)} ${payload.currency.toUpperCase()} ที่ ${payload.from} ราคา ${payload.price} ${payload.compare.toUpperCase()}`,
        type: 'text'
      }
      latestPrice[payload.currency] = payload.price
      return result
  }
}
