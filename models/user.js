const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define model structure
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('User', userSchema)
