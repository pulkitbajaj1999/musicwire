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
      })
    })
    .catch((err) => {
      console.log('Error while fething albums!\n', err)
      return res.render('500InternalServerError')
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
            })
          })
      } else {
        throw Error(`No album found when fetching album: ${albumId}`)
      }
    })
    .catch((err) => {
      console.log('Error while fething album!\n', err)
      return res.render('500InternalServerError')
    })
}

module.exports.getCreateAlbum = (req, res) => {
  return res.render('create_album', { path: '/album/add' })
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
    const uploadResult = await b2.uploadFile(fileKey, file.path)
    if (uploadResult) {
      album.imageUrl = '/' + uploadResult.Key // file-key will act as a file path on b2
    } else {
      album.imageUrl = '/images/default_album_logo.png'
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
      return res.render('500InternalServerError')
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
      return res.render('500InternalServerError')
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
      return res.render('500InternalServerError')
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
        })
      } else {
        throw Error('No album found')
      }
    })
    .catch((err) => {
      console.log('Error while fetching add-song to album!\n', err)
      return res.render('500InternalServerError')
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
    const uploadResult = await b2.uploadFile(fileKey, file.path)
    if (uploadResult) {
      song.audioFile = '/' + uploadResult.Key // file-key will act as a file path on b2
    }
  }
  song
    .save()
    .then((song) => {
      res.redirect(back_url)
    })
    .catch((err) => {
      console.log('Error while adding song to album!\n', err)
      return res.render('500InternalServerError')
    })
}
