// utils
const b2 = require('../utils/b2')

// models
const User = require('../models/user')
const Playlist = require('../models/playlist')
const Song = require('../models/song')

module.exports.getPublicPlaylists = (req, res, next) => {
  Playlist.find({ isPublic: true })
    .lean()
    .then((playlists) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'playlists fetched success',
        playlists: playlists,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.getUserPlaylists = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId)
    return res.status(401).json({
      status: 'error',
      msg: 'user not logged-in',
    })
  User.findById(userId)
    .populate('playlists')
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
        msg: 'user playlists fetch success',
        playlists: user.playlists,
      })
    })
    .catch((err) => {
      console.log('err', err)
      next(err)
    })
}

module.exports.getPlaylistById = (req, res, next) => {
  const { playlistId } = req.params
  if (!playlistId)
    return res.status(400).json({
      status: 'error',
      msg: 'playlistId not provided',
    })

  Playlist.findById(playlistId)
    .lean()
    .then((playlist) => {
      if (!playlist)
        return res.status(404).json({
          status: 'error',
          msg: 'playlist not present',
        })
      return res.status(200).json({
        status: 'ok',
        msg: 'playlist-by-id fetch success',
        playlist: playlist,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.postAddPlaylist = async (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId) {
    return res.status(401).json({
      status: 'error',
      msg: 'user not logged-in',
    })
  }
  const { title, description, isPublic } = req.body
  if (!title)
    return res.status(400).json({
      status: 'error',
      msg: 'title not present',
    })
  const playlist = new Playlist({ title: title })
  playlist.description = description ? description : null
  playlist.userId = userId
  // isPublic defaults to false
  if (isPublic || req.user.role === 'ADMIN') playlist.isPublic = true

  // uploading image
  if (req.files && req.files.imageFile) {
    const file = req.files.imageFile[0]
    const fileKey = `media/images/${file.filename}`
    playlist.imageUrl = fileKey
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
  playlist
    .save()
    .then((playlist) => {
      return res.status(201).json({
        status: 'ok',
        msg: 'playlist added',
        playlist: playlist,
      })
    })
    .catch((err) => {
      next(err)
    })
}

// ##handle uploading file before deleting
module.exports.patchEditPlaylist = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId) {
    return res.status(401).json({
      status: 'error',
      msg: 'user not logged-in',
    })
  }
  const { playlistId, title, description, isPublic } = req.body
  if (!playlistId || !title)
    return res.status(200).json({
      status: 'ok',
      msg: 'playlistid or title not provided',
    })

  Playlist.findById(playlistId)
    .then((playlist) => {
      if (!playlist)
        return res.status(404).json({
          status: 'error',
          msg: 'playlist not found',
        })
      if (
        req.user.role !== 'ADMIN' &&
        playlist.userId.toString() !== userId.toString()
      ) {
        return res.status(401).json({
          status: 'error',
          msg: 'current user not authorized to edit this playlist',
        })
      }
      // editing playlist
      playlist.title = title
      playlist.description = description
      playlist.isPublic = isPublic ? true : false

      // editing image
      if (req.files && req.files.imageFile) {
        const file = req.files.imageFile[0]
        const fileKey = `media/images/${file.filename}`
        const prevFileKey = playlist.imageUrl
        playlist.imageUrl = fileKey
        if (process.env.ENABLE_B2_STORAGE === 'true') {
          return Promise.all([
            b2.deleteFile(prevFileKey),
            b2.uploadFile(fileKey, file.path),
          ]).then(() => {
            return playlist.save()
          })
        }
      }
      return playlist.save()
    })
    .then((playlist) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'playlist edited',
        playlist: playlist,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.deletePlaylist = (req, res, next) => {
  const userId = req.user ? req.user._id : null
  if (!userId)
    return res.status(401).json({
      status: 'ok',
      msg: 'user not logged in',
    })
  const { playlistId } = req.body
  if (!playlistId)
    return res.status(400).json({
      status: 'error',
      msg: 'playlistId not provided',
    })

  Playlist.findById(playlistId)
    .then((playlist) => {
      if (!playlist)
        return res.status(404).json({
          status: 'error',
          msg: 'playlist not found',
        })
      if (process.env.ENABLE_B2_STORAGE === 'true') {
        return b2.deleteFile(playlist.imageUrl).then(() => {
          return playlist.remove()
        })
      }
      return playlist.remove()
    })
    .then((result) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'playlist deleted',
        result: result,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.postAddSongToPlaylist = (req, res, next) => {
  const { playlistId, songId } = req.body
  if (!playlistId || !songId)
    return res.status(400).json({
      status: 'error',
      msg: 'playlistId or songId not provided',
    })
  Promise.all([Playlist.findById(playlistId), Song.findById(songId)])
    .then(([playlist, song]) => {
      if (!playlist)
        return res.status(404).json({
          status: 'error',
          msg: 'playlist not exist',
        })
      if (!song)
        return res.status(404).json({
          status: 'error',
          msg: 'song not found',
        })
      if (playlist.songs.indexOf(songId) === -1) {
        playlist.songs.push(songId)
        return playlist.save().then((playlist) => {
          return res.status(200).json({
            status: 'ok',
            msg: 'song added to playlist',
            playlist: playlist,
          })
        })
      }
      return res.status(200).json({
        status: 'ok',
        msg: 'song already present',
        playlist: playlist,
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports.patchDeleteSongFromPlaylist = (req, res, next) => {
  const { playlistId, songId } = req.body
  if (!playlistId || !songId)
    return res.status(400).json({
      status: 'error',
      msg: 'playlistId or songId not provided',
    })
  Promise.all([Playlist.findById(playlistId), Song.findById(songId)])
    .then(([playlist, song]) => {
      if (!playlist)
        return res.status(404).json({
          status: 'error',
          msg: 'playlist not exist',
        })
      if (!song)
        return res.status(404).json({
          status: 'error',
          msg: 'song not found',
        })
      const index = playlist.songs.indexOf(songId)
      if (index !== -1) {
        playlist.songs.splice(index, 1)
        return playlist.save().then((playlist) => {
          return res.status(200).json({
            status: 'ok',
            msg: 'song deleted from playlist',
            playlist: playlist,
          })
        })
      }
      return res.status(404).json({
        status: 'error',
        msg: 'song not present in playlist',
        playlist: playlist,
      })
    })
    .catch((err) => {
      next(err)
    })
}
