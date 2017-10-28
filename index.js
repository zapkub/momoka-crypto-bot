/**
 * Create by Rungsikorn Rungsikavanich
 * email: rungsikorn@me.com
 * MIT License
 */

require('isomorphic-fetch')
const config = require('./config')
const chalk = require('chalk')
const DBConnection = require('./lib/DBConnection')

process.on('unhandledRejection', function (reason, p) {
  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

const bodyParser = require('body-parser')
const app = require('express')()

const fs = require('fs')
const path = require('path')
const showdown = require('showdown')
const converter = new showdown.Converter()

app.use(require('express-ping').ping())

app.use(bodyParser.json({extended: true}))

async function initApp (_config, strategies) {
  if (_config) {
    config.setConfig(_config)
  }
  let connection
  if (config.mongoURL) {
    try {
      connection = await DBConnection(config.mongoURL)
    } catch (e) {
      console.log('no db, notification service will be offline')
    }
  }

  const lineBot = require('./adapter/messenger/line.adapter')
  const facebookBot = require('./adapter/messenger/facebook.adapter')

  app.get('/', async (req, res) => {
    const html = converter.makeHtml(fs.readFileSync(path.join(__dirname, './CHANGELOG.md')).toString())
    res.send(`<head><link href='https://sindresorhus.com/github-markdown-css/github-markdown.css' rel='stylesheet' /></head>` + `<section class='markdown-body'>${html}</section>`)
  })
  for (let strategy of strategies) {
    console.log(`Add strategy action: ${strategy.action}`)
  }
  app.use('/line', lineBot(strategies, config))
  app.use('/facebook', facebookBot(strategies, config))

  function onSigterm () {
    console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
  // start graceul shutdown here
    connection.disconnect()
    process.exit(0)
  }
  process.on('SIGTERM', onSigterm)
  process.on('SIGINT', onSigterm)
  return {
    start () {
      app.listen(config.port, function () {
        console.log(chalk.bgGreen('==== app is start on ' + config.port + ' ===='))
        if (connection.readyState === 1) {
          console.log('Notification service is online')
          const notificationService = require('./adapter/notification.service')
          notificationService.startWatcher()
        }
      })
    }
  }
}

module.exports = initApp
