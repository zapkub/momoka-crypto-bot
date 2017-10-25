
exports.mappingOperator = function mappingOperator ({operation, value}, result) {
  switch (operation) {
    case 'MORE_THAN':
      return {
        text: 'มากกว่า',
        isMatch: result > value
      }
    case 'LESS_THAN':
      return {
        text: 'น้อยกว่า',
        isMatch: result < value
      }
  }
}

exports.abstractStrategy = {
  test: /^metar [a-zA-Z]{6}$/,
  action: 'airports/metar',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      currency: words[1]
    }
  },
  /**
   * Resolve method will receive
   * result from mapToPayload
   * @param { payload: mapToPayloadResult, type: string }
   * @return { resolveResultType }
   */
  resolve: async (action) => {
  },
  /**
   * ConditionResolve will run everytime in notification lool
   * resolve undefined if there is nothing to noti
   * @param error
   * @param { resolveResultType }
   * @param { notificationInfo }
   * @return { type: 'text', text: string }
   */
  conditionResolve: async (error, result, notification) => {

  },

  /**
   * Message reducer will send response to user immeditaly
   * @param { resolveResultType }
   * @return { type: 'text', text: string }
   */
  messageReducer: async (error, result) => {

  }
}
