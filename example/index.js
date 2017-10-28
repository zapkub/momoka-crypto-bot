const momoka = require('../index')

const strategies = require('./strategy/index')
const _config = require('./config')

momoka(_config, strategies).then((bot) => {
  bot.start()
})
