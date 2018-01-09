require('dotenv').config({})
let _config = {
  shortcutRegex: /^[a-zA-Z]{6}$|^compare$|^[a-zA-Z]{9}$|^compare\s[\w]+$/,
  port: process.env.PORT,
  botName: process.env.BOT_NAME,
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

module.exports = _config
