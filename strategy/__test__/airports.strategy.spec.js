require('isomorphic-fetch')
const airportsStrategy = require('../airports.strategy').metarStrategy

const msg = 'metar vtbd'
describe('Airport strategy test', () => {
  it('should return result from metar vtbd', async () => {
    const isMatch = airportsStrategy.test.test(msg)
    expect(isMatch).toBeTruthy()

    const mapPayloadResult = await airportsStrategy.mapToPayload({
      text: msg
    })
    expect(mapPayloadResult.airportName).toEqual('vtbd')

    const resolveResult = await airportsStrategy.resolve({
      payload: mapPayloadResult
    })
    expect(resolveResult).toEqual(expect.anything())

    const responseMessage = await airportsStrategy.messageReducer(undefined, resolveResult)

    console.log(responseMessage)
  })
})
