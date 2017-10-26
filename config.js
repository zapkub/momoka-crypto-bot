require('dotenv').config({})
const throwConfigError = (name) => { throw new Error(name) }
const config = {
  port: process.env.PORT || 6969,
  botName: process.env.BOT_NAME || 'โมโมกะ',
  mongoURL: process.env.MONGODB_URL,
  domain: process.env.DOMAIN || throwConfigError('Bot domain is undefined'),
  facebook: {
    pageToken: process.env.FACEBOOK_PAGE_TOKEN
  },
  line: {
    id: process.env.LINE_CHANNEL_ID,
    secret: process.env.LINE_CHANNEL_SECRET,
    token: process.env.LINE_CHANNEL_TOKEN
  },
  ICAO_API_KEY: process.env.ICAO_API_KEY
}

module.exports = config
