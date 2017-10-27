const Messenger = require('../adapter')
const config = require('../../../config')
const DBConnection = require('../../../lib/DBConnection')
const actions = require('../../../parser/actions')

describe('Messenger adapter test', () => {
  let connection
  // beforeAll(async () => {
  //   connection = await DBConnection(config.mongoURL)
  // })
  // afterAll(async () => {
  //   await connection.disconnect()
  // })
  let adapter = new Messenger([{
    test: /ลองเทส/,
    action: 'mock/test-action',
    mapToPayload: (event) => {
      return {
        value: 'test'
      }
    },
    resolve: (action) => {
      if (action.payload.value === 'test') {
        return {
          value: 'tested'
        }
      }
      throw new Error('resolve error payload is not test')
    },
    messageReducer: (error, resolveResult) => {
      if (error) { throw error }
      return {
        type: 'text',
        text: 'alert tested'
      }
    }
  }], config)
  adapter.__provider = 'LINE'
  it('should return value with GET_PRICE action correctly', async () => {
    const result = await adapter.getResponseMessage({
      type: 'mock/test-action',
      payload: {
        value: 'test'
      }
    })
    expect(result).toEqual(expect.anything())
    expect(result.text).toContain('alert tested')
  })
})
