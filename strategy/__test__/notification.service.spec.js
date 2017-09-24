const ACTIONS = require('../../parser/actions')
const notificationService = require('../notification.service')
describe('Notification service test', () => {
  const action = {
    type: ACTIONS.CONDITION_ALERT,
    subType: ACTIONS.GET_PRICE,
    command: 'omgthb',
    condition: {
      type: 'MORE_THAN',
      value: 300
    },
    payload: {
      compare: 'thb',
      currency: 'omg'
    }
  }

  it('should create new notification document', () => {

  })
})
