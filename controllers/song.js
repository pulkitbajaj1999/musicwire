// import utils
const b2 = require('../utils/b2')

// import models
const Song = require('../models/song')
const User = require('../models/user')

// controllers
module.exports.getSongs = (req, res, next) => {
  Song.find()
    .lean()
    .then((songs) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'songs fetch success',
        songs: songs,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.getSongById = (req, res, next) => {
  const { songId } = req.params
  if (!songId)
    return res.status(400).json({
      status: 'error',
      msg: 'song-id not provided',
    })
  Song.findById(songId)
    .lean()
    .then((song) => {
      if (!song) {
        return res.status(404).json({
          status: 'error',
          msg: 'song not found',
        })
      }
      return res.status(200).json({
        status: 'ok',
        msg: 'song-by-id fetch success',
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.getUserSongs = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId) {
    return res.status(401).json({
      status: 'error',
      msg: 'user not logged-in',
    })
  }
  User.findById(userId)
    .populate('favorites')
    .lean()
    .then((user) => {
      if (!user) {
        return res.status(500).json({
          status: 'error',
          msg: 'user not found in database, login again',
        })
      }
      return res.status(200).json({
        status: 'ok',
        msg: 'favorites fetched',
        songs: user.favorites,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.patchToggleFavorite = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId)
    return res.status(401).json({
      status: 'ok',
      msg: 'user not logged in',
    })

  const { songId } = req.body
  if (!songId)
    return res.status(400).json({
      status: 'error',
      msg: 'song-id not provided',
    })

  Promise.all([User.findById(userId), Song.findById(songId)])
    .then(([user, song]) => {
      if (!user) {
        return res.status(500).json({
          status: 'error',
          msg: 'user not found in database, login again',
        })
      }
      if (!song)
        return res.status(404).json({
          status: 'error',
          msg: 'song not present',
        })
      return user
        .toggleFavorite(songId)
        .then((user) => {
          return user.populate('favorites')
        })
        .then((user) => {
          return res.status(200).json({
            status: 'ok',
            msg: 'favorite toggled',
            favorites: user.favorites,
          })
        })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.postAddSong = async (req, res, next) => {
  const { title, artist, description } = req.body
  if (!title || !req.files || !req.files.audioFile)
    return res.status(400).json({
      status: 'error',
      msg: 'title or audioFile not provided',
    })

  const song = new Song({
    title,
  })
  song.artist = artist ? artist : null
  song.description = description ? description : null
  if (req.files && req.files.imageFile) {
    const file = req.files.imageFile[0]
    const fileKey = `media/images/${file.filename}`
    song.imageUrl = fileKey
    if (process.env.ENABLE_B2_STORAGE === 'true') {
      try {
        await b2.uploadFile(fileKey, file.path)
      } catch (err) {
        return res.status(500).json({
          status: 'error',
          msg: 'image upload to b2 failed',
        })
      }
    }
  }
  if (req.files && req.files.audioFile) {
    const file = req.files.audioFile[0]
    const fileKey = `media/audio/${file.filename}`
    song.audioUrl = fileKey
    if (process.env.ENABLE_B2_STORAGE === 'true') {
      try {
        await b2.uploadFile(fileKey, file.path)
      } catch (err) {
        return res.status(500).json({
          status: 'error',
          msg: 'audio upload to b2 failed',
          err: err,
        })
      }
    }
  }
  song
    .save()
    .then((song) => {
      return res.status(201).json({
        status: 'ok',
        msg: 'song added',
        song: song,
      })
    })
    .catch((err) => {
      next(err)
    })
}

// ##handle uploading file before deleting
module.exports.patchEditSong = async (req, res, next) => {
  const { songId, title, artist, description } = req.body
  if (!songId || !title)
    return res.status(400).json({
      status: 'error',
      msg: 'songid or title not provided',
    })

  let currentSong
  Song.findById(songId)
    .then((song) => {
      if (!song)
        return res.status(404).json({
          status: 'error',
          msg: 'song not found',
        })
      currentSong = song
      currentSong.title = title
      currentSong.artist = artist
      currentSong.description = description
      if (req.files && req.files.imageFile) {
        const file = req.files.imageFile[0]
        const fileKey = `media/images/${file.filename}`
        const prevFileKey = currentSong.imageUrl
        currentSong.imageUrl = fileKey
        if (process.env.ENABLE_B2_STORAGE === 'true') {
          return Promise.all([
            b2.deleteFile(prevFileKey),
            b2.uploadFile(fileKey, file.path),
          ])
        }
      }
    })
    .then(() => {
      if (req.files && req.files.audioFile) {
        const file = req.files.audioFile[0]
        const fileKey = `media/audio/${file.filename}`
        const prevFileKey = currentSong.audioUrl
        currentSong.audioUrl = fileKey
        if (process.env.ENABLE_B2_STORAGE === 'true') {
          return Promise.all([
            b2.deleteFile(prevFileKey),
            b2.uploadFile(fileKey, file.path),
          ])
        }
      }
    })
    .then(() => {
      return currentSong.save()
    })
    .then((currentSong) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'song edited',
        song: currentSong,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.deleteSong = (req, res, next) => {
  const { songId } = req.body
  if (!songId)
    return res.status(400).json({
      status: 'error',
      msg: 'songId not provided',
    })
  Song.findById(songId)
    .then((song) => {
      if (!song)
        return res.status(200).json({
          status: 'error',
          msg: 'song does not exist',
        })
      if (process.env.ENABLE_B2_STORAGE === 'true') {
        return Promise.all([
          b2.deleteFile(song.imageUrl),
          b2.deleteFile(song.audioUrl),
        ]).then(() => {
          return song.remove()
        })
      }
      return song.remove()
    })
    .then((song) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'song deleted',
        song: song,
      })
    })
    .catch((err) => {
      next(err)
    })
}
