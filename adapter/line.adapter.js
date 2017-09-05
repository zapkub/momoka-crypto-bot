const line = require('@line/bot-sdk')
const Router = require('express').Router
const parser = require('../parser')
const ACTIONS = require('../parser/actions')

module.exports = function (strategy, {port, line: { id, secret, token }}) {
  this.awake = false
  const middleware = Router()
  const config = {
    channelAccessToken: token,
    channelSecret: secret
  }
  const client = new line.Client(config)

  middleware.post('/', async (req, res) => {
    const { events } = req.body
    const result = await Promise.all(events.map(async ({ source, replyToken, type, message }) => {
      if (type === 'message' || type === 'text') {
        const user = await client.getProfile(source.userId)
        const action = parser({
          text: message.text
        })

        if (!action) {
          return null
        }
        switch (action.type) {
          case ACTIONS.AWAKE:
            this.awake = true
            return client.replyMessage(replyToken, {
              type: 'text',
              text: 'ตื่นแล้วค่า'
            })
          case ACTIONS.SLEEP:
            this.awake = false
            return client.replyMessage(replyToken, {
              type: 'text',
              text: 'คร่อกกกก 😴'
            })
        }
        if (!this.awake) {
          return null
        }
        const responseText = await strategy(action, user)
        return client.replyMessage(replyToken, {
          type: 'text',
          text: responseText
        })
      }
    }).filter(message => message))
    res.json(result)
  })
  return middleware
}
