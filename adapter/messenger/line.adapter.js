const line = require('@line/bot-sdk')
const Router = require('express').Router
const createParser = require('../../parser')
const chalk = require('chalk')
const MesssengerAdapter = require('./adapter')
const API_ENDPOINT = 'https://api.line.me/v2/bot/message/push'

class LineAdapter extends MesssengerAdapter {
  constructor ({ channelAccessToken, channelSecret }, strategies) {
    super()
    console.log(chalk.yellow('Init LINE adapter'))
    this.__provider = 'LINE'
    this.channelAccessToken = channelAccessToken
    this.channelSecret = channelSecret
    this.parser = createParser(strategies)
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
    console.log(chalk.yellow('Line: Send message.....'))
    const result = await global.fetch(API_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.channelAccessToken}`
      },
      method: 'post',
      body: JSON.stringify(payload)
    })
    console.log(chalk.bgGreen('Line: Message sent!'))
    return result
  }

  async resolveUser (source) {
    try {
      if (source.userId) {
        const user = await this.client.getProfile(source.userId)
        if (user) {
          console.log(chalk.bold(`${user.displayName}`))
        } else {
          console.log(chalk.red('Cannot get user profile from'), source.userId)
        }
      }
    } catch (e) {
      console.log(chalk.red('Line: get user profile error: ') + `${e.statusCode}`)
    }
  }

  async requestHandler (req, res) {
    const { events } = req.body
    const responseResultPromises = events.map(async event => {
      const { source, replyToken, type, message } = event
      console.log(chalk.bgBlue(`Incoming message: ${(new Date()).toISOString()}`))
      console.log(chalk.blue(`from: ${source.userId || source.groupId}`))
      await this.resolveUser(source)
      if (event.type === 'message') {
        const action = this.parser({
          type: event.type,
          text: event.message.text,
          source
        })
        console.log(`Text: "${event.message.text}"`)
        try {
          const message = await this.getResponseMessage(action)
          if (!message) {
            return null
          }
          console.log('Response: ', message, replyToken)
          return this.client.replyMessage(replyToken, message)
        } catch (e) {
          console.error(e)
          return null
        }
      }
    })

    const responseResults = await Promise.all(responseResultPromises)
    console.log(chalk.bgGreen(`Response ${responseResults.length} messages to Line: ${(new Date()).toISOString()} `))
    res.json(responseResults.filter(message => !!message))
  }
}

module.exports = function ({ line: { id, secret, token } }, strategies) {
  const middleware = Router()
  const lineClient = new LineAdapter({
    channelAccessToken: token,
    channelSecret: secret
  }, strategies)
  // middleware part
  // below this is the adapter handler for line msg
  // from webhook
  middleware.post('/', lineClient.requestHandler.bind(lineClient))

  return middleware
}
