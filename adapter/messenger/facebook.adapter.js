
const chalk = require('chalk')
const MesssengerAdapter = require('./adapter')

const FACEBOOK_ENDPOINT = 'https://graph.facebook.com/v2.6'
class FacebookAdapter extends MesssengerAdapter {
  constructor (strategies, config) {
    const { pageToken, appSecret, verifyToken } = config
    super(strategies, config)
    this.pageToken = pageToken
    this.__provider = 'FACEBOOK'
  }
  async sendMessage (sourceId, message) {
    console.log(chalk.yellow('Facebook: Send message.....'))
    console.log(sourceId)
    const response = await global.fetch(`${FACEBOOK_ENDPOINT}/me/messages?access_token=${this.pageToken}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        recipient: {
          id: sourceId
        },
        message: {
          text: message.text
        }
      })
    })
    const result = await response.text()
    console.log(result)
    console.log(message)
    console.log(chalk.bgGreen('Facebook: Message sent!'))
  }
  async requestHandler (req, res) {
    if (req.body.object === 'page') {
      const { entry } = req.body
      Promise.all(entry.map(async event => {
        // reduce message

        const resultMessages = []
        await Promise.all(event.messaging.map(async messageObject => {
          if (messageObject.message) {
            const {message, recipient, sender} = messageObject
            const source = { userId: sender.id }
            console.log(chalk.bgBlue(`Incoming message: ${(new Date()).toISOString()}`))
            const action = this.parser({
              type: 'message',
              text: message.text,
              source
            })
            console.log('Facebook: ' + action)
            const echoMessages = await this.getResponseMessage(action)
            echoMessages.forEach((message) => {
              resultMessages.push({
                source,
                message
              })
            })
          } else {
            console.log(chalk.yellow('Facebook: Unknown webhook'))
          }
        }
      ))

        // send messsage
        await Promise.all(resultMessages.map(async result => {
          await this.sendMessage(result.source.userId, result.message)
        }))
      }))
    }
    res.status(200).send(req.query['hub.challenge'])
  }
}

module.exports = function (strategies, config) {
  const { facebook: { pageToken, secret } } = config
  const Router = require('express').Router()
  const facebookClient = new FacebookAdapter(strategies, {
    verifyToken: 'hider',
    pageToken,
    ...config
  })

  Router.all('/', facebookClient.requestHandler.bind(facebookClient))
  Router.get('/cancel_noti/:id', facebookClient.removeNotificationHandler.bind(facebookClient))
  console.log(chalk.blue('Facebook: start'))
  return Router
}
