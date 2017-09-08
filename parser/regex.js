const REGEX = {
  CALL_FOR_PRICE: /โมโมกะ\sขอราคา\s\w{3}\s\w{3}\sจาก\s\w+/g,
  CALL_FOR_PRICE_SHORTCUT: /\w{3}\s\w{3}/g,
  REQUEST_INTERVAL_FOR_CURRENCY: /โมโมกะ\sขอราคา\s\w{3}\s\w{3}\sทุกๆ\s[0-9]+\sนาที/g,
  CALL_CALCULATE: /โมโมกะ\s\d+\.?\d+\s(\*|\+|\/|-)\s\d+\.?\d+/,
  CLEAR_INTERVAL: /โมโมกะ ไม่ต้องเตือนแล้ว/,
  CALL_ALL_PRICE: /ขอราคาทั้งหมด/,
  SLEEP: 'โมโมกะ ไปนอน',
  NUDE: 'โมโมกะ ถอดเสื้อ',
  AWAKE: 'โมโมกะ ตื่น'
}
module.exports = REGEX
