const chalk = require('chalk')
const init = async mongoURL => {
  console.log(chalk.yellow(`MongoDB : ${mongoURL}`))

  const mongoose = require('mongoose')
  mongoose.Promise = global.Promise
  return new Promise(async (resolve, reject) => {
  // Debug
    mongoose.connection.on('connected', () => {
      console.log(chalk.green(`MongoDB :`, 'Connection Established'))
      resolve({
        get readyState () {
          return mongoose.connection.readyState
        },
        disconnect: () => {
          mongoose.disconnect()
          console.log('disconnected')
        }
      })
    })
    mongoose.connection.on('reconnected', () => console.log(`MongoDB :`, 'Connection Reestablished'))
    mongoose.connection.on('disconnected', () => console.log(`MongoDB :`, 'Connection Disconnected'))
    mongoose.connection.on('close', () => console.log(`MongoDB :`, 'Connection Closed'))
    mongoose.connection.on('error', err => console.error(`MongoDB :`, err))
    mongoose.connect(mongoURL, {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    })
  })
}

module.exports = init
