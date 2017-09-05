const etcStrategy = require('../etc.strategy').strategy
const ACTIONS = require('../../parser/actions')
require('isomorphic-fetch')

describe('etc strategy test', () => {
  it('should send nude for nude ', async () => {
    const result = await etcStrategy({type: ACTIONS.NUDE})
    expect(result.type).toEqual('image')
  })
})
