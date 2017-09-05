
const ACTIONS = require('../parser/actions')
exports.strategy = async function ({ type, payload }) {
  switch (type) {
    case ACTIONS.NUDE :
      return {
        type: 'image',
        originalContentUrl: 'https://cdn.javout.net/wp-content/uploads/2016/10/1pondo-080815_130-glamorous-sakai-momoka-180x253.jpg',
        previewImageUrl: 'https://cdn.javout.net/wp-content/uploads/2016/10/1pondo-080815_130-glamorous-sakai-momoka-180x253.jpg'
      }
    case 'TEXT':
      console.log(payload)
      return {
        type: 'text',
        text: payload.message
      }
  }
}
