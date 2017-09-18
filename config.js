require('dotenv').config({})
const config = {
  port: process.env.PORT || 6969,
  botName: process.BOT_NAME || 'โมโมกะ',
  line: {
    id: process.env.LINE_CHANNEL_ID,
    secret: process.env.LINE_CHANNEL_SECRET,
    token: process.env.LINE_CHANNEL_TOKEN
  }
}

module.exports = config
