exports.combineStrategy = function combineStrategy (strategies) {
  return async (action) => {
    for (let index in strategies) {
      const result = await strategies[index](action)
      if (result) {
        return result
      }
    }
  }
}
