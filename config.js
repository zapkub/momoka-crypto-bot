require('dotenv').config({})
const config = {
  port: process.env.PORT || 6969,
  botName: process.env.BOT_NAME || 'โมโมกะ',
  mongoURL: process.env.MONGODB_URL,
  domain: process.env.DOMAIN,
  facebook: {
    pageToken: process.env.FACEBOOK_PAGE_TOKEN
  },
  line: {
    id: process.env.LINE_CHANNEL_ID,
    secret: process.env.LINE_CHANNEL_SECRET,
    token: process.env.LINE_CHANNEL_TOKEN
  }
}

module.exports = config
