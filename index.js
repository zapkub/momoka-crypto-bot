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

const fs = require('fs')
const path = require('path')
const showdown = require('showdown')
const converter = new showdown.Converter()

app.use(require('express-ping').ping())

app.use(bodyParser.json({extended: true}))

async function initApp () {
  await DBConnection(config.mongoURL)

  const lineBot = require('./adapter/messenger/line.adapter')
  const facebookBot = require('./adapter/messenger/facebook.adapter')
  app.get('/', async (req, res) => {
    const html = converter.makeHtml(fs.readFileSync(path.join(__dirname, './CHANGELOG.md')).toString())
    res.send(`<head><link href='https://sindresorhus.com/github-markdown-css/github-markdown.css' rel='stylesheet' /></head>` + `<section class='markdown-body'>${html}</section>`)
  })
  const strategies = require('./strategy/index')
  app.use('/line', lineBot(strategies, config))
  app.use('/facebook', facebookBot(strategies, config))
  const notificationService = require('./adapter/notification.service')
  notificationService.startWatcher()
  app.listen(config.port, function () {
    console.log('app start!: ' + config.port)
  })
}

initApp()
