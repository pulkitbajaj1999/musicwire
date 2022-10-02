const staticData = require('../utils/static_data')

module.exports.getAllAlbums = (req, res) => {
  return res.render('albums', {
    albums: staticData.albums,
    path: '/album',
  })
}

module.exports.getAlbum = (req, res) => {
  return res.render('album_details', {
    album: staticData.albums[0],
    songs: [staticData.songs[0]],
    rightPanel: 'songs',
  })
}

module.exports.getCreateAlbum = (req, res) => {
  return res.render('create_album', { path: '/album/add' })
}

module.exports.postCreateAlbum = (req, res) => {
  return res.send('<h1>post-album</h1>')
}

module.exports.postDeleteAlbum = (req, res) => {
  const backUrl = req.body.back_url
  return res.redirect(backUrl)
}
module.exports.postToggleFav = (req, res) => {
  const albumId = parseInt(req.body.album_id)
  const backUrl = req.body.back_url
  const album = staticData.albums.find((el) => el.id == albumId)
  if (album) {
    album.isfavorite = !album.isfavorite
  }
  return res.redirect(backUrl)
}

module.exports.getAddSongToAlbum = (req, res) => {
  res.render('album_details', {
    album: staticData.albums[0],
    rightPanel: 'add',
  })
}

module.exports.postAddSongToAlbum = (req, res) => {
  res.redirect('/album')
}
