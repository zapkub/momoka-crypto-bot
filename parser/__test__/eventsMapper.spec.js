const actions = require('../actions')
const mappers = require('../eventsMapper')
describe('Event mapper test', () => {
  it('should parse action correclty')
  it('should parse เตือน condition correctly', () => {
    for (let mapper of mappers) {
      if (mapper.action === actions.CONDITION_ALERT) {
        const result = mapper.mapToPayload({
          text: 'เตือน omgthb เมื่อ มากกว่า 230'
        })
        console.log(result)
      }
    }
  })
})
