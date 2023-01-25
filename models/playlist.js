const mongoose = require('mongoose')
const Schema = mongoose.Schema

// import models
const User = require('./user')

// define model structure
const playListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  songs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Playlist',
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

playListSchema.pre('save', async function (doc) {
  if (this.isNew) {
    const user = await User.findById(this.userId)
    user.playlists.push(this._id)
    await user.save()
  }
})

module.exports = mongoose.model('Playlist', playListSchema)
