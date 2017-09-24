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
  console.log(event)
  if (event.type === 'message') {
    const botNameRegex = new RegExp(`${config.botName}`)
    if (event.text.match(botNameRegex) || shortcutParse(event.text)) {
      event.text = event.text.replace('โมโมกะ', '').trim()
      const result = mapEventWithAction(event)

      // check if it begin with alert function
      if (result.type === ACTIONS.INTERVAL || result.type === ACTIONS.CONDITION_ALERT) {
        const subAction = mapEventWithAction({
          text: result.payload.command,
          type: 'message'
        })
        return {
          ...result.payload,
          source: event.source,
          subType: subAction.type,
          payload: subAction.payload
        }
      } else {
        return {
          ...result,
          source: event.source
        }
      }
    }
  }
  return undefined
}
