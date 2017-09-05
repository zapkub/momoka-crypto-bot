
const REGEX = require('./regex')
const ACTIONS = require('./actions')
// this module is where all event parse

module.exports = function ({ text }) {
  if (text.match(REGEX.CALL_FOR_PRICE)) {
    const words = text.split(' ')
    return {
      type: ACTIONS.GET_PRICE,
      payload: {
        currency: words[1].toLowerCase(),
        compare: words[2].toLowerCase(),
        from: words[4].toLowerCase()
      }
    }
  } else if (text.match(REGEX.CALL_FOR_PRICE_SHORTCUT)) {
    const words = text.split(' ')
    return {
      type: ACTIONS.GET_PRICE,
      payload: {
        currency: words[0].toLowerCase(),
        compare: words[1].toLowerCase(),
        from: 'bx'
      }
    }
  } else if (text.match(REGEX.SLEEP)) {
    return {
      type: ACTIONS.SLEEP
    }
  } else if (text.match(REGEX.AWAKE)) {
    return {
      type: ACTIONS.AWAKE
    }
  } else if (text.match(REGEX.NUDE)) { return { type: ACTIONS.NUDE } }
}
