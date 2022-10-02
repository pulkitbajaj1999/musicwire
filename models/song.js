const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define model structure
const songSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  audioFile: {
    type: String,
    required: false,
  },
  isfavorite: {
    type: Boolean,
    required: true,
    default: false,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
  },
})

module.exports = mongoose.model('Song', songSchema)
