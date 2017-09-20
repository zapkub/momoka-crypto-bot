const ACTIONS = require('./actions')
const eventsMapper = require('./eventsMapper')
const config = require('../config')
// this module is where all event parse

function mapEventWithAction (event) {
  if (event.type === 'message') {
    for (let mapper of eventsMapper) {
      if (event.text.match(mapper.test)) {
        const mapperObject = Object.assign({
          mapToPayload: () => ({})
        }, mapper)
        const payload = mapperObject.mapToPayload(event)
        return {
          type: mapperObject.action,
          payload
        }
      }
    }
  }
  return {
    type: 'unhandle',
    text: event.text
  }
}
function shortcutParse (text) {
  return text.match(/(^[a-zA-Z]{6}$)|(^[a-zA-Z]{3}\s[a-zA-Z]{3}$)|compare/)
}
module.exports = function (event) {
  if (event.type === 'message') {
    const botNameRegex = new RegExp(`${config.botName}`)
    if (event.text.match(botNameRegex) || shortcutParse(event.text)) {
      event.text = event.text.replace('โมโมกะ', '').trim()
      const result = mapEventWithAction(event)

      // check if it begin with alert function
      if (result.type === ACTIONS.INTERVAL) {
        const subAction = mapEventWithAction({
          text: result.payload.command,
          type: 'message'
        })
        return {
          type: ACTIONS.INTERVAL,
          subType: subAction.type,
          interval: result.payload.interval,
          payload: subAction.payload
        }
      } else {
        return result
      }
    }
  }
  return undefined
}
