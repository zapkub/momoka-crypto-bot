const line = require('@line/bot-sdk')
const Router = require('express').Router

module.exports = function (strategy, {port, line: { id, secret, token }}) {
  const middleware = Router()
  const config = {
    channelAccessToken: token,
    channelSecret: secret
  }
  console.log(config)
  const client = new line.Client(config)

  middleware.post('/', async (req, res) => {
    const { events } = req.body
    const result = await Promise.all(events.map(async ({ replyToken, type, message }) => {
      if (type === 'message' || type === 'text') {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: strategy({
            type: 'text',
            text: message.text
          })
        })
      }
    }))
    console.log(result)
    res.json(result)
  })
  return middleware
}
