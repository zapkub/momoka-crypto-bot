
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
