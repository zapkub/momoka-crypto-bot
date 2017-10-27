
const ACTIONS = require('../../parser/actions')
const config = require('../../config')
const DBConnection = require('../../lib/DBConnection')
const NotificationModel = require('../../models/Notification.model')

describe('Notification service test', () => {
  let notificationService
  let notification
  let connection
  if (config.mongoURL) {
    beforeAll(async () => {
      connection = await DBConnection(config.mongoURL)
      notificationService = require('../notification.service')
    })
    afterAll(async () => {
      await connection.disconnect()
    })
    const createAction = {
      type: ACTIONS.CONDITION_ALERT,
      source: {
        groupId: 'mockGroup',
        userId: 'mock'
      },
      subType: 'crypto/get-price',
      command: 'xrpthb',
      condition: {
        operation: 'MORE_THAN',
        value: 11
      },
      payload: {
        compare: 'thb',
        currency: 'xrp'
      }
    }

    it('should create new notification document', async () => {
      await notificationService.actionHandler(createAction)
      notification = await NotificationModel.findOne({ ownerId: 'mock', receptionId: 'mockGroup' })
      expect(notification).toEqual(expect.anything())
    })

    it('should not add an exist notification', async () => {
      const result = await notificationService.actionHandler(createAction)
      expect(result.action).toContain('มีการแจ้งเตือนนี้ไว้แล้ว')
      notifications = await NotificationModel.find({ ownerId: 'mock', receptionId: 'mockGroup' })
      expect(notifications.length).toEqual(1)
    })

    it('should remove notification correctly', async () => {
      await notificationService.actionHandler({
        type: ACTIONS.CANCEL_ALERT,
        payload: {
          id: notification.id
        }
      })

      notification = await NotificationModel.findOne({ ownerId: 'mock', receptionId: 'mockGroup' })
      expect(notification).toBeNull()
    })
  } else {
    it('skip notificatio test due to lack of db connection')
  }
})
