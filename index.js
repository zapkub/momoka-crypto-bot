const momoka = require('momoka-core-bot')

const strategies = require('./strategy/index')
const _config = require('./config')

momoka(_config, strategies).then((bot) => {
  bot.start()
})
