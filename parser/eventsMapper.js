const actions = require('./actions')
const eventsMapper = [
  {
    test: /เตือน\s.+\sทุกๆ\s[0-9]{1,2}\sนาที/g,
    action: actions.INTERVAL,
    mapToPayload: (event) => {
      const words = event.text
        .split(/(\sทุกๆ)|(เตือน\s)|(\sนาที)/)
        .filter(word => !!word)
        .map(word => word.trim())
      return {
        type: actions.INTERVAL,
        command: words[1],
        interval: parseInt(words[3]) * 1000 * 60
      }
    }
  },
  {
    test: /เตือน\s.+\sเมื่อ\s(มากกว่า|น้อยกว่า|แพงกว่า|ถูกกว่า)\s-?[0-9]+(\.[0-9]{1,2})?$/g,
    action: actions.CONDITION_ALERT,
    mapToPayload: (event) => {
      const words = event.text
        .split(/(\sเมื่อ)|(เตือน\s)|(\sนาที)/)
        .filter(word => !!word)
        .map(word => word.trim())
      const condition = words[3].split(' ')
      return {
        type: actions.CONDITION_ALERT,
        command: words[1],
        condition: {
          operation: condition[0] === 'มากกว่า' || condition[0] === 'แพงกว่า' ? 'MORE_THAN' : 'LESS_THAN',
          value: parseFloat(condition[1])
        }
      }
    }
  },
  {
    test: /^เตือนอะไรไว้บ้าง$|^เตือนอะไรอยู่บ้าง$|^มีเตือนอะไรไว้มั่ง$/,
    action: actions.LIST_ALERT,
    mapToPayload: (event) => ({})
  },
  {
    test: /เลิกเตือน\s\w+/,
    action: actions.CANCEL_ALERT,
    mapToPayload: (event) => {
      const words = event.text.split(' ')
      return {
        id: words[1]
      }
    }
  }
]

module.exports = eventsMapper
