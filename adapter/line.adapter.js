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
        // const user = await client.getProfile(source.userId)
        const action = parser({
          text: message.text
        })

        if (!action) {
          return null
        }
        switch (action.type) {
          case ACTIONS.AWAKE: {
            if (!this.awake) {
              this.awake = true
              return client.replyMessage(replyToken, {
                type: 'text',
                text: 'ตื่นแล้วค่า'
              })
            }
            break
          }
          case ACTIONS.SLEEP:
            if (this.awake) {
              this.awake = false
              return client.replyMessage(replyToken, {
                type: 'text',
                text: 'คร่อกกกก 😴'
              })
            }
            break
        }
        if (!this.awake) {
          return null
        }
        if (action.type === ACTIONS.NUDE) {
          return client.replyMessage(replyToken, {
            type: 'image',
            originalContentUrl: 'https://cdn.javout.net/wp-content/uploads/2016/10/1pondo-080815_130-glamorous-sakai-momoka-180x253.jpg',
            previewImageUrl: 'https://cdn.javout.net/wp-content/uploads/2016/10/1pondo-080815_130-glamorous-sakai-momoka-180x253.jpg'
          })
        }
        const responseText = await strategy(action)
        return client.replyMessage(replyToken, responseText)
      }
    }).filter(message => message))
    res.json(result)
  })
  return middleware
}
