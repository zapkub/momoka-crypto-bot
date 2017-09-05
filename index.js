require('dotenv').config({})
require('isomorphic-fetch')
const config = {
  port: process.env.PORT || 6969,
  line: {
    id: process.env.LINE_CHANNEL_ID,
    secret: process.env.LINE_CHANNEL_SECRET,
    token: process.env.LINE_CHANNEL_TOKEN
  }
}

const bodyParser = require('body-parser')
const app = require('express')()
const { combineStrategy } = require('./utils')
const lineBot = require('./adapter/line.adapter')

const bxStrategy = require('./strategy/bx.strategy').strategy
const etcStrategy = require('./strategy/etc.strategy').strategy
const rootStrategy = combineStrategy([bxStrategy, etcStrategy])

app.use(bodyParser.json({extended: true}))
app.get('/', (req, res) => {
  res.send('hi')
})
app.use('/line', lineBot(rootStrategy, config))
app.listen(config.port, function () {
  console.log('app start!')
})
