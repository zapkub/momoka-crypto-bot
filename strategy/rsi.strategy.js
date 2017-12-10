
require('isomorphic-fetch')
const ENDPOINT = (market, pairing, after, periods) =>
  `https://api.cryptowat.ch/markets/${market}/${pairing}/ohlc?after=${
    after
  }&periods=${periods}`

exports.getOHLCData = async function (market = 'bitfinex', pairing, periods) {
  const after = Date.now() - (60 * 60 * 24 * 1000)
  const url = ENDPOINT(market, pairing, Math.round(after / 1000), periods)
  const response = await global.fetch(url)
  const data = await response.json()
  return data.result[periods]
  /**
   * Array of data.results[time] contain attribute of candle stick
   * [ CloseTime, OpenPrice, HighPrice, LowPrice, ClosePrice, Volume ]
   */
}
