const API_ENDPOINT = (airportName) =>
`https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/weather/current-conditions-list?airports=${airportName}&api_key=eaebea30-b993-11e7-b846-9f5013227327&format=json`

exports.abstractStrategy = {
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
    return {
      type: 'text',
      text: JSON.stringify(result)
    }
  }
}
