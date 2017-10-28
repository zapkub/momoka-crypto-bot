const config = require('../config')
const API_ENDPOINT = (airportName) =>
`https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/weather/current-conditions-list?airports=${airportName}&api_key=${config.ICAO_API_KEY}&format=json`

exports.metarStrategy = {
  test: /^metar [a-zA-Z]{4}$/,
  action: 'airports/metar',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      airportName: words[1]
    }
  },
  resolve: async (action) => {
    const response = await global.fetch(API_ENDPOINT(action.payload.airportName))
    const result = await response.json()
    return result
  },
  messageReducer: async (error, result) => {
    console.log(result)
    var len = result[0].raw_metar.length
    var count = len - 9
    return {
      type: 'text',
      text: (result[0].raw_metar).substr(0, count)+' ค่ะ'
    }
  }
}
