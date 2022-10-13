const Song = require('../models/song')

module.exports.getAllSongs = (req, res) => {
  Song.find()
    .lean()
    .populate('album')
    .then((songs) => {
      res.render('songs', {
        songs: songs,
        filterBy: 'all',
        path: '/song',
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
    .catch((err) => {
      console.log('Error while getting all songs!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.getfavoriteSongs = (req, res) => {
  Song.find({ isfavorite: true })
    .lean()
    .populate('album')
    .then((songs) => {
      res.render('songs', {
        songs: songs,
        filterBy: 'favorite',
        path: '/song/favorite',
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
    .catch((err) => {
      console.log('Error while getting all songs!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.togglefavorite = (req, res) => {
  const songId = req.body.song_id
  const backUrl = req.body.back_url
  Song.findById(songId)
    .then((song) => {
      if (song) {
        song.isfavorite = !song.isfavorite
        return song.save()
      } else {
        throw new Error('No song found')
      }
    })
    .then((song) => {
      res.redirect(backUrl)
    })
    .catch((err) => {
      console.log('Error while toggling faorite song!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
      })
    })
}

module.exports.postDeleteSong = (req, res) => {
  const songId = req.body.song_id
  const backUrl = req.body.back_url
  Song.findByIdAndDelete(songId)
    .then((song) => {
      if (song) {
        res.redirect(backUrl)
      } else {
        throw new Error('No such song to delete!')
      }
    })
    .catch((err) => {
      console.log('Error while deleting song!')
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}
