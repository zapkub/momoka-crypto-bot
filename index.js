/**
 * Create by Rungsikorn Rungsikavanich
 * email: rungsikorn@me.com
 * MIT License
 */

require('isomorphic-fetch')
const config = require('./config')
const DBConnection = require('./lib/DBConnection')

process.on('unhandledRejection', function (reason, p) {
  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

const bodyParser = require('body-parser')
const app = require('express')()
app.use(require('express-ping').ping())

app.use(bodyParser.json({extended: true}))

async function initApp () {
  await DBConnection(config.mongoURL)

  const lineBot = require('./adapter/messenger/line.adapter')
  const arbitageStrategy = require('./strategy/arbitage.strategy')
  app.get('/', async (req, res) => {
    const result = await arbitageStrategy.getArbitagePriceByCurrencyList(['omg', 'btc', 'eth', 'xrp'])
    res.json(result)
  })
  app.use('/line', lineBot(config, require('./strategy/index')))
  app.listen(config.port, function () {
    console.log('app start!')
  })
}

initApp()
