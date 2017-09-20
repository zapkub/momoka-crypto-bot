const parser = require('..')
const ACTIONS = require('../actions')

describe('Language parser test', function () {
  it('should parse cmd correctly', async () => {
    expect(parser({
      type: 'message',
      text: 'โมโมกะ ตื่น'
    })).toEqual({
      type: ACTIONS.AWAKE,
      payload: {}
    })
  })
  it('should return get GET_ARBITAGE_PRICE on เทียบราคานอกหน่อย and compare', () => {
    expect(parser({
      type: 'message',
      text: 'compare'
    })).toEqual({
      type: ACTIONS.GET_ARBITAGE_PRICE,
      payload: {}
    })
  })
  it('should not return anything if text doenst start with BOT_NAME', () => {
    expect(parser({
      type: 'message',
      text: 'ตื่น'
    })).toBeUndefined()
  })
  it('should parse omg thb correctly also with capitalize', () => {
    expect(parser({
      type: 'message',
      text: 'omg thb'
    })).toEqual({
      type: ACTIONS.GET_PRICE,
      payload: {
        compare: 'thb',
        currency: 'omg'
      }
    })
    expect(parser({
      type: 'message',
      text: 'โมโมกะ thb usd'
    })).toEqual({
      type: ACTIONS.GET_PRICE,
      payload: {
        compare: 'usd',
        currency: 'thb'
      }
    })
    expect(parser({
      type: 'message',
      text: 'Xrpusd'
    })).toEqual({
      type: ACTIONS.GET_PRICE,
      payload: {
        compare: 'usd',
        currency: 'xrp'
      }
    })
  })
  it('should parse เตือน correctly', async () => {
    let commandList = [
      {
        command: 'omg thb',
        expect: ACTIONS.GET_PRICE,
        payload: {
          compare: 'thb',
          currency: 'omg'
        }
      },
      {
        command: 'เทียบราคานอกหน่อย',
        expect: ACTIONS.GET_ARBITAGE_PRICE,
        payload: {}
      }
    ]

    for (let commandObject of commandList) {
      const result = parser({
        type: 'message',
        text: `โมโมกะ เตือน ${commandObject.command} ทุกๆ 5 นาที`
      })
      expect(result).toEqual({
        type: ACTIONS.INTERVAL,
        subType: commandObject.expect,
        interval: 1000 * 5 * 60,
        payload: commandObject.payload
      })
    }
  })
})
