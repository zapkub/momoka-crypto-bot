const actions = require('./actions')
const eventsMapper = [
  {
    test: /โมโมกะ\sขอราคา\s\w{3}\s\w{3}\sจาก\s\w+/g,
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
    test: /\w{3}\s\w{3}/g,
    action: actions.GET_PRICE,
    mapToPayload: (event) => {
      const words = event.text.split(' ')
      return {
        currency: words[0].toLowerCase(),
        compare: words[1].toLowerCase(),
        from: words[1] === 'thb' ? 'bx' : 'cryptowat'
      }
    }
  },
  {
    test: /โมโมกะ\sขอราคา\s\w{3}\s\w{3}\sทุกๆ\s[0-9]+\sนาที/g,
    action: actions.INTERVAL,
    type: actions.GET_PRICE
  },
  {
    test: /โมโมกะ\s\d+\.?\d+\s(\*|\+|\/|-)\s\d+\.?\d+/,
    action: actions.CALCULATE
  },
  {
    test: 'โมโมกะ ตื่น',
    action: actions.AWAKE
  },
  {
    test: /โมโมกะ\sเตือน\s.+\sทุกๆ\s[0-9]{1,2}\sนาที/,
    action: actions.INTERVAL,
    mapToPayload: (event) => {

    }
  },
  {
    test: /โมโมกะ เทียบราคานอกหน่อย/,
    action: actions.GET_ARBITAGE_PRICE,
    mapToPayload: (event) => {
      return {

      }
    }
  }
]
  // CLEAR_INTERVAL: /โมโมกะ ไม่ต้องเตือนแล้ว/,
  // CALL_FOR_ARBITAGE_LIST:
  // CALL_ALL_PRICE: /ขอราคาทั้งหมด/,
  // SLEEP: 'โมโมกะ ไปนอน',
  // NUDE: 'โมโมกะ ถอดเสื้อ',
// }
module.exports = eventsMapper
