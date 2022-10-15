const Song = require('../models/song')
const b2 = require('../utils/b2')

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

module.exports.getEditSong = (req, res) => {
  const songId = req.params.songId
  Song.findById(songId)
    .lean()
    .then((song) => {
      if (song) {
        return res.render('edit_song', {
          song: song,
          isLoggedIn: req.isLoggedIn,
          csrf_token: req.csrfToken(),
        })
      } else {
        throw Error('Song not found!')
      }
    })
    .catch((err) => {
      console.log('Error while fetching edit song page!', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.postEditSong = (req, res) => {
  const { song_title, song_id, back_url } = req.body
  Song.findById(song_id)
    .then((song) => {
      song.title = song_title
      if (req.files && req.files.audio_file) {
        const file = req.files.audio_file[0]
        const fileKey = `media/songs/${file.filename}`
        const prevFileKey = song.audioFile.startsWith('/')
          ? song.audioFile.slice(1)
          : song.audioFile
        song.audioFile = '/' + fileKey
        if (process.env.ENABLE_B2_STORAGE === 'true') {
          return Promise.all([
            b2.deleteFile(prevFileKey),
            b2.uploadFile(fileKey, file.path),
          ]).then(() => {
            return song.save()
          })
        }
      }
      return song.save()
    })
    .then((song) => {
      res.redirect(back_url)
    })
    .catch((err) => {
      console.log('Error while editing song!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}
