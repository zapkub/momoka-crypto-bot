const Messenger = require('../adapter')
const actions = require('../../../parser/actions')

describe('Messenger adapter test', () => {
  let adapter = new Messenger()
  adapter.__provider = 'LINE'
  it('should return value with GET_PRICE action correctly', async () => {
    const result = await adapter.getResponseMessage({
      type: actions.GET_PRICE,
      payload: {
        compare: 'thb',
        currency: 'omg',
        from: 'bx'
      }
    })
    expect(result).toEqual(expect.anything())
    expect(result.type).toEqual('text')
    expect(result.text).toContain('ราคา')
  })
})
