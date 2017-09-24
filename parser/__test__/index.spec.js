const parser = require('..')
const ACTIONS = require('../actions')

describe('Language parser test', function () {
  it('should parse cmd correctly', async () => {
    expect(parser({
      type: 'message',
      text: 'โมโมกะ ตื่น',
      source: {
        groupId: 'mock'
      }
    })).toEqual({
      type: ACTIONS.AWAKE,
      source: {
        groupId: 'mock'
      },
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
  it('should parse เตือน with condition correctly', async () => {
    const result = parser({
      type: 'message',
      text: 'โมโมกะ เตือน omgthb เมื่อ มากกว่า 300',
      source: {}
    })
    expect(result).toEqual({
      type: ACTIONS.CONDITION_ALERT,
      subType: ACTIONS.GET_PRICE,
      command: 'omgthb',
      condition: {
        operation: 'MORE_THAN',
        value: 300
      },
      source: {},
      payload: {
        compare: 'thb',
        currency: 'omg'
      }
    })
  })
  it('should parse เตือน with interval correctly', async () => {
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
        interval: 1000 * 5 * 60,
        type: ACTIONS.INTERVAL,
        command: commandObject.command,
        subType: commandObject.expect,
        payload: commandObject.payload
      })
    }
  })
})
