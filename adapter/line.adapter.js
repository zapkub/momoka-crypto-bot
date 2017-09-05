const line = require('@line/bot-sdk')
const Router = require('express').Router
const parser = require('../parser')
const ACTIONS = require('../parser/actions')
const API_ENDPOINT = 'https://api.line.me/v2/bot/message/push'
module.exports = function (strategy, {port, line: { id, secret, token }}) {
  this.awake = true
  this.interval = undefined

  const middleware = Router()
  const config = {
    channelAccessToken: token,
    channelSecret: secret
  }
  const client = new line.Client(config)
  function flushInterval () {
    if (this.interval) { clearInterval(this.interval) }
  }
  function addInterval (action, source) {
    const { payload } = action
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(async () => {
      action.type = action.payload.action
      const responseText = await strategy(action)
      const payload = {
        to: source.groupId || source.userId,
        messages: [ responseText ]
      }
      console.log(payload)
      const result = await global.fetch(API_ENDPOINT, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.channelAccessToken}`
        },
        method: 'post',
        body: JSON.stringify(payload)
      })
    }, payload.interval * 1000 * 60)
  }

  // middleware part
  // below this is the adapter handler for line msg
  // from webhook
  middleware.post('/', async (req, res) => {
    const { events } = req.body
    const result = await Promise.all(events.map(async ({ source, replyToken, type, message }) => {
      if (type === 'message' || type === 'text') {
        // const user = await client.getProfile(source.userId)
        const action = parser({
          text: message.text
        })
        console.log(action)

        if (!action) {
          return null
        }
        switch (action.type) {
          case ACTIONS.AWAKE: {
            if (!this.awake) {
              this.awake = true
              return client.replyMessage(replyToken, {
                type: 'text',
                text: 'ตื่นแล้วค่า 💁🏻'
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
          case ACTIONS.CLEAR_INTERVAL: {
            flushInterval()
            return client.replyMessage(replyToken, {
              type: 'text',
              text: 'ยกเลิกการเตือนให้แล้วค่ะ 👌🏻'
            })
          }
          case ACTIONS.INTERVAL: {
            addInterval(action, source)
            return client.replyMessage(replyToken, {
              type: 'text',
              text: 'ตั้งเวลาแล้วค่ะ ✌🏻'
            })
          }
        }

        if (!this.awake) {
          return null
        }
        const responseText = await strategy(action)
        if (responseText) {
          return client.replyMessage(replyToken, responseText)
        }
      }
    }).filter(message => message))
    res.json(result)
  })

  return middleware
}
