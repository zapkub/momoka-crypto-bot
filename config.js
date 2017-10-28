
const throwConfigError = (config, key) => {
  if (!config[key]) {
    throw new Error(key + ' is not defined in environment config')
  }
}

let _config = {

}
module.exports = {
  setConfig (config) {
    throwConfigError(config, 'botName')
    throwConfigError(config, 'line')
    _config = config
  },
  get port () {
    return _config.port
  },
  get botName () {
    return _config.botName || 'โมโมกะ'
  },
  get mongoURL () {
    return _config.mongoURL || 'mongodb://localhost:27017/momoka'
  },
  get domain () {
    return _config.domain
  },
  get facebook () {
    return _config.facebook
  },
  get line () {
    return _config.line
  }
}
