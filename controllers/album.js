const path = require('path')
const b2 = require('../utils/b2')

const Album = require('../models/album')
const Song = require('../models/song')

module.exports.getAllAlbums = (req, res) => {
  Album.find()
    .lean()
    .then((albums) => {
      res.render('albums', {
        albums: albums,
        path: '/album',
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
    .catch((err) => {
      console.log('Error while fething albums!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.getAlbum = (req, res) => {
  const albumId = req.params.albumId
  Album.findById(albumId)
    .lean()
    .then((album) => {
      if (album) {
        Song.find({ album: albumId })
          .lean()
          .then((songs) => {
            res.render('album_details', {
              album: album,
              songs: songs,
              rightPanel: 'songs',
              isLoggedIn: req.isLoggedIn,
              csrf_token: req.csrfToken(),
            })
          })
      } else {
        throw Error(`No album found when fetching album: ${albumId}`)
      }
    })
    .catch((err) => {
      console.log('Error while fething album!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.getCreateAlbum = (req, res) => {
  return res.render('create_album', {
    path: '/album/add',
    isLoggedIn: req.isLoggedIn,
    csrf_token: req.csrfToken(),
  })
}

module.exports.postCreateAlbum = async (req, res) => {
  const { album_title, artist, genre } = req.body
  const album = new Album({
    title: album_title,
    artist: artist,
    genre: genre,
  })

  // if image for album logo is uploaded then store it to b2 bucket
  if (req.files && req.files.album_logo) {
    const file = req.files.album_logo[0]
    const fileKey = `media/albums/${file.filename}`
    album.imageUrl = '/' + fileKey
    if (process.env.ENABLE_B2_STORAGE === 'true') {
      await b2.uploadFile(fileKey, file.path)
    }
  }
  // else store the default logo
  else {
    album.imageUrl = '/images/default_album_logo.png'
  }
  album
    .save()
    .then((album) => {
      res.redirect('/album')
    })
    .catch((err) => {
      console.log('Error while creating album!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.getEditAlbum = (req, res) => {
  const albumId = req.query.album_id
  Album.findById(albumId)
    .lean()
    .then((album) => {
      if (album) {
        return res.render('create_album', {
          path: '/album/edit',
          album: album,
          isLoggedIn: req.isLoggedIn,
          csrf_token: req.csrfToken(),
        })
      } else {
        return res.render('500InternalServerError', {
          isLoggedIn: req.isLoggedIn,
          csrf_token: req.csrfToken(),
        })
      }
    })
}

module.exports.postEditAlbum = async (req, res) => {
  const { albumId, album_title, artist, genre } = req.body
  Album.findById(albumId)
    .then((album) => {
      album.title = album_title
      album.artist = artist
      album.genre = genre
      // if image for album logo is uploaded then replace old image in b2 bucket
      if (req.files && req.files.album_logo) {
        const file = req.files.album_logo[0]
        const fileKey = `media/albums/${file.filename}`
        const prevFileKey = album.imageUrl.startsWith('/')
          ? album.imageUrl.slice(1)
          : album.imageUrl
        album.imageUrl = '/' + fileKey
        if (process.env.ENABLE_B2_STORAGE === 'true') {
          return Promise.all([
            b2.deleteFile(prevFileKey),
            b2.uploadFile(fileKey, file.path),
          ]).then(() => {
            return album.save()
          })
        }
      }
      return album.save()
    })
    .then((album) => {
      res.redirect('/album')
    })
    .catch((err) => {
      console.log('Error while editing album!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.postDeleteAlbum = (req, res) => {
  const albumId = req.body.album_id
  const backUrl = req.body.back_url
  // delete all songs related to that model
  Song.deleteMany({ album: albumId })
    .then((deleteResult) => {
      if (deleteResult.acknowledged) {
        return Album.findByIdAndDelete(albumId)
      } else {
        throw new Error('Failed to delete all songs contained in album!')
      }
    })
    .then((album) => {
      if (album) {
        res.redirect(backUrl)
      } else {
        throw new Error('Failed to delete album!')
      }
    })
    .catch((err) => {
      console.log('Error while deleting album!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.postToggleFav = (req, res) => {
  const albumId = req.body.album_id
  const backUrl = req.body.back_url
  Album.findById(albumId)
    .then((album) => {
      if (album) {
        album.isfavorite = !album.isfavorite
        return album.save()
      } else throw new Error('No album found!')
    })
    .then((album) => {
      res.redirect(backUrl)
    })
    .catch((err) => {
      console.log('Error while toggling favorite album!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.getAddSongToAlbum = (req, res) => {
  const albumId = req.params.albumId
  Album.findById(albumId)
    .lean()
    .then((album) => {
      if (album) {
        res.render('album_details', {
          album: album,
          rightPanel: 'add',
          isLoggedIn: req.isLoggedIn,
          csrf_token: req.csrfToken(),
        })
      } else {
        throw Error('No album found')
      }
    })
    .catch((err) => {
      console.log('Error while fetching add-song to album!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}

module.exports.postAddSongToAlbum = async (req, res) => {
  const { song_title, album_id, back_url } = req.body
  const song = new Song({
    title: song_title,
    album: album_id,
  })
  if (req.files && req.files.audio_file) {
    const file = req.files.audio_file[0]
    const fileKey = `media/songs/${file.filename}`
    song.audioFile = '/' + fileKey
    if (process.env.ENABLE_B2_STORAGE === 'true') {
      await b2.uploadFile(fileKey, file.path)
    }
  }
  song
    .save()
    .then((song) => {
      res.redirect(back_url)
    })
    .catch((err) => {
      console.log('Error while adding song to album!\n', err)
      return res.render('500InternalServerError', {
        isLoggedIn: req.isLoggedIn,
        csrf_token: req.csrfToken(),
      })
    })
}
