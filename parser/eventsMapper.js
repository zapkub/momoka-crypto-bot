const actions = require('./actions')
const eventsMapper = [
  {
    test: /ขอราคา\s\w{3}\s\w{3}\sจาก\s\w+/g,
    type: 'text',
    action: actions.GET_PRICE,
    mapToPayload: (event) => {
      const words = event.text.split(' ')
      return {
        currency: words[2].toLowerCase(),
        compare: words[3].toLowerCase(),
        from: words[5].toLowerCase()
      }
    }
  },
  {
    test: /(^[a-zA-Z]{6}$)|(^[a-zA-Z]{3}\s[a-zA-Z]{3}$)/g,
    action: actions.GET_PRICE,
    mapToPayload: (event) => {
      const words = event.text.split(' ')
      if (words.length === 1) {
        return {
          currency: words[0].substring(0, 3).toLowerCase(),
          compare: words[0].substring(3, 6).toLowerCase()
        }
      }
      return {
        currency: words[0].toLowerCase(),
        compare: words[1].toLowerCase()
      }
    }
  },
  {
    test: /ขอราคา\s\w{3}\s\w{3}\sทุกๆ\s[0-9]+\sนาที/g,
    action: actions.INTERVAL,
    type: actions.GET_PRICE
  },
  {
    test: /\d+\.?\d+\s(\*|\+|\/|-)\s\d+\.?\d+/,
    action: actions.CALCULATE
  },
  {
    test: /ตื่น/,
    action: actions.AWAKE
  },
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
    test: /เทียบราคานอกหน่อย|compare/,
    action: actions.GET_ARBITAGE_PRICE,
    mapToPayload: (event) => {
      return {

      }
    }
  }
]

module.exports = eventsMapper
