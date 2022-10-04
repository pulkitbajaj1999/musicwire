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
      })
    })
    .catch((err) => {
      console.log('Error while getting all songs!\n', err)
      return res.render('500InternalServerError')
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
      })
    })
    .catch((err) => {
      console.log('Error while getting all songs!\n', err)
      return res.render('500InternalServerError')
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
      return res.render('500InternalServerError')
    })
}

module.exports.postDeleteSong = (req, res) => {
  const songId = req.body.song_id
  const backUrl = req.body.back_url
  Song.findByIdAndRemove(songId)
    .then((song) => {
      if (song) {
        res.redirect(backUrl)
      } else {
        throw new Error('No such song to delete!')
      }
    })
    .catch((err) => {
      console.log('Error while deleting song!')
      return res.render('500InternalServerError')
    })
}
