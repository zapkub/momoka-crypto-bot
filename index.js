require('isomorphic-fetch')
const config = require('./config')

process.on('unhandledRejection', function (reason, p) {
  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
  // application specific logging here
})
const bodyParser = require('body-parser')
const app = require('express')()
const lineBot = require('./adapter/messenger/line.adapter')

const arbitageStrategy = require('./strategy/arbitage.strategy')
app.use(bodyParser.json({extended: true}))

app.get('/', async (req, res) => {
  const result = await arbitageStrategy.getArbitagePriceByCurrencyList(['omg', 'btc', 'eth', 'xrp'])
  res.json(result)
})
app.use('/line', lineBot(config))
app.listen(config.port, function () {
  console.log('app start!')
})
