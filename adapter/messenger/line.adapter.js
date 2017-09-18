const line = require('@line/bot-sdk')
const Router = require('express').Router
const parser = require('../../parser')
const ACTIONS = require('../../parser/actions')
const MesssengerAdapter = require('./adapter')
const API_ENDPOINT = 'https://api.line.me/v2/bot/message/push'

class LineAdapter extends MesssengerAdapter {
  constructor ({ channelAccessToken, channelSecret }) {
    super()
    this.channelAccessToken = channelAccessToken
    this.channelSecret = channelSecret
    this.client = new line.Client({
      channelAccessToken,
      channelSecret
    })
  }
  set awake (isAwake) {
    this.__awake = isAwake
  }
  async sendMessage (sourceId, messages) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    const payload = {
      to: sourceId,
      messages: messages
    }
    const result = await global.fetch(API_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.channelAccessToken}`
      },
      method: 'post',
      body: JSON.stringify(payload)
    })
    return result
  }

  async resolveUser (source) {
    if (source.userId) {
      const user = this.client.getProfile(source.userId)
    }
  }

  async requestHandler (req, res) {
    const { events } = req.body
    const responseResultPromises = events.map(async event => {
      const { source, replyToken, type, message } = event
      console.log('from: ' + source.userId || source.groupId)
      await this.resolveUser(source)
      if (event.type === 'message') {
        const action = parser({
          type: event.type,
          text: event.message.text
        })
        console.log('text: ' + event.message.text)
        try {
          const message = await this.getResponseMessage(action)
          if (!message) {
            return null
          }
          console.log('reply message', message, replyToken)
          return this.client.replyMessage(replyToken, message)
        } catch (e) {
          console.error(e)
          return null
        }
      }
    })

    console.log('Response message to line')
    const responseResults = await Promise.all(responseResultPromises)
    res.json(responseResults.filter(message => !!message))
  }
}

module.exports = function ({port, line: { id, secret, token }}) {
  const middleware = Router()
  const lineClient = new LineAdapter({
    channelAccessToken: token,
    channelSecret: secret
  })
  // middleware part
  // below this is the adapter handler for line msg
  // from webhook
  middleware.post('/', lineClient.requestHandler.bind(lineClient))

  return middleware
}
