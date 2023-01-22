const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define model structure
const songSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  artist: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('Song', songSchema)
