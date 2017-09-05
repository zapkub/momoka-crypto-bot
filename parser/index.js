
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
  } else if (text.match(REGEX.CALL_FOR_PRICE_SHORTCUT) && text.split(' ').length === 2) {
    const words = text.split(' ')
    return {
      type: ACTIONS.GET_PRICE,
      payload: {
        currency: words[0].toLowerCase(),
        compare: words[1].toLowerCase(),
        from: 'bx'
      }
    }
  } else if (text.match(REGEX.REQUEST_INTERVAL_FOR_CURRENCY)) {
    const words = text.split(' ')
    try {
      if (parseInt(words[5]) < 1) {
        return {
          type: 'TEXT',
          payload: {
            message: 'เวลาห้ามน้อยกว่า 1 นาทีนะจ้ะ'
          }
        }
      }
      return {
        type: ACTIONS.INTERVAL,
        payload: {
          action: ACTIONS.GET_PRICE,
          from: 'bx',
          currency: words[2],
          compare: words[3],
          interval: parseInt(words[5])
        }
      }
    } catch (e) {
      return {
        type: ACTIONS.ERROR
      }
    }
  } else if (text.match(REGEX.CLEAR_INTERVAL)) {
    return {
      type: ACTIONS.CLEAR_INTERVAL
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
