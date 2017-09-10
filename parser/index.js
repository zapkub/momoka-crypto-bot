
const eventsMapper = require('./eventsMapper')
// this module is where all event parse

module.exports = function (event) {
  for (let mapper of eventsMapper) {
    if (event.type === 'message') {
      if (event.text.match(mapper.test)) {
        const mapperObject = Object.assign({
          mapToPayload: () => ({})
        }, mapper)
        return {
          type: mapperObject.action,
          payload: mapperObject.mapToPayload(event)
        }
      }
    }
  }
  return {
    type: 'unhandle'
  }
}
