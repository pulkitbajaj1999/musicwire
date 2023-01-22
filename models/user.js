const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define model structure
const userSchema = new Schema({
  profile: {
    type: Schema.Types.Mixed,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'USER', 'GUEST'],
  },
  playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
})

userSchema.methods.toggleFavorite = function (songId) {
  const songIndex = this.favorites.indexOf(songId)
  if (songIndex === -1) this.favorites.push(songId)
  else this.favorites.splice(songIndex, 1)
  return this.save()
}

module.exports = mongoose.model('User', userSchema)
