  const mongoose = require('mongoose')
  const chalk = require('chalk')

  const memoryCache = {}
  require('./Notification.model')
  require('./User.model')
  require('./Command.model')
  module.exports = function (modelName) {
    if (mongoose.connection.readyState === 1) {
      console.log(chalk.green(`Models: ${modelName} is available`))
      const model = mongoose.model(modelName)

      return {
        create: async (data) => {
          const result = await model.create(data)

          return result
        },
        read: async (query) => {
          const result = await model.find(query)
          return result || []
        },
        update: (query, data) => {

        },
        delete: async (id) => {
          const result = await model.findByIdAndRemove(id)
          return result
        }
      }
    } else {
      console.log(chalk.yellow('Models: DB status is not connected, will use in memory'))
      return {
        create: (data) => {
          return {}
        },
        read: (query) => {
          return []
        },
        update: () => {

        },
        delete: () => {

        }
      }
    }
  }
