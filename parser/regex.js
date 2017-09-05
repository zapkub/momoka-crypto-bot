const REGEX = {
  CALL_FOR_PRICE: /ขอราคา\s\w{3}\s\w{3}\sจาก\s\w+/g,
  CALL_FOR_PRICE_SHORTCUT: /\w{3}\s\w{3}/g,
  CALL_ALL_PRICE: /ขอราคาทั้งหมด/,
  SLEEP: 'โมโมกะ ไปนอน',
  NUDE: 'โมโมกะ ถอดเสื้อ',
  AWAKE: 'โมโมกะ ตื่น'
}
module.exports = REGEX
