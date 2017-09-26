
const MesssengerAdapter = require('./adapter')
class FacebookAdapter extends MesssengerAdapter {
  constructor ({ appId, appSecret, verifyToken }) {
    super()
  }
  async requestHandler (req, res) {
    res.status(200).send(req.query['hub.challenge'])
  }
}
module.exports = function ({ facebook: { id, secret } }) {
  const Router = require('express').Router()
  const facebookClient = new FacebookAdapter({
    verifyToken: 'hija'
  })

  Router.all('/', facebookClient.requestHandler.bind(facebookClient))

  return Router
}
