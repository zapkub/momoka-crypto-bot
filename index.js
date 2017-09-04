require('dotenv').config({})
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
const lineBot = require('./adapter/line.adapter')
const bxStrategy = require('./strategy/bx.strategy')

app.use(bodyParser())
app.get('/', (req, res) => {
  res.send('hi')
})
app.use('/line', lineBot(bxStrategy, config))
app.listen(config.port, function () {
  console.log('app start!')
})
