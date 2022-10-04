const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define model structure
const albumSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: false,
  },
  genre: {
    type: String,
    required: false,
  },
  isfavorite: {
    type: Boolean,
    required: true,
    default: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('Album', albumSchema)
