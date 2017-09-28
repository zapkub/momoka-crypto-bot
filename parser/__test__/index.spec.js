const ACTIONS = require('../actions')
const strategies = require('../../strategy')
const parser = require('..')(strategies)

describe('Language parser test', function () {
  it('should return get GET_ARBITAGE_PRICE on เทียบราคานอกหน่อย and compare', () => {
    expect(parser({
      type: 'message',
      text: 'compare'
    })).toEqual({
      type: ACTIONS.GET_ARBITAGE_PRICE_LIST,
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
      type: 'crypto/get-price',
      payload: {
        compare: 'thb',
        currency: 'omg'
      }
    })
    expect(parser({
      type: 'message',
      text: 'โมโมกะ thb usd'
    })).toEqual({
      type: 'crypto/get-price',
      payload: {
        compare: 'usd',
        currency: 'thb'
      }
    })
    expect(parser({
      type: 'message',
      text: 'Xrpusd'
    })).toEqual({
      type: 'crypto/get-price',
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
      subType: 'crypto/get-price',
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
        source: {},
        payload: {
          compare: 'thb',
          currency: 'omg'
        }
      },
      {
        command: 'เทียบราคานอกหน่อย',
        expect: ACTIONS.GET_ARBITAGE_PRICE_LIST,
        source: {},
        payload: {}
      }
    ]

    for (let commandObject of commandList) {
      const result = parser({
        type: 'message',
        text: `โมโมกะ เตือน ${commandObject.command} ทุกๆ 5 นาที`,

        source: {}
      })
      expect(result).toEqual({
        interval: 1000 * 5 * 60,
        type: ACTIONS.INTERVAL,
        command: commandObject.command,
        subType: commandObject.expect,
        source: {},
        payload: commandObject.payload
      })
    }
  })
})
