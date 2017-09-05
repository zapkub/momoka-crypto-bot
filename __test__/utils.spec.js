const bxStrategy = require('../strategy/bx.strategy').strategy
const etcStrategy = require('../strategy/etc.strategy').strategy
const Actions = require('../parser/actions')
const { combineStrategy } = require('../utils')
describe('Utiils test', () => {
  it('should combine strategy correctly', async () => {
    const rootStrategy = combineStrategy([bxStrategy, etcStrategy])
    const result = await rootStrategy({ type: Actions.NUDE, payload: { } })
    expect(result.type).toEqual('image')
  })
})
