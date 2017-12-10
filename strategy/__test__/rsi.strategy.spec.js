const { getOHLCData } = require('../rsi.strategy')
const fs = require('fs')
const path = require('path')

describe('RSI Test', () => {
  it('Should able to get OHCL data', async () => {
    const result = await getOHLCData('bitfinex', 'omgusd', '1800')
    fs.writeFileSync(
      path.join(__dirname, './ohlc.tmp.json'),
      JSON.stringify(result, null, 3)
    )
  })
})
