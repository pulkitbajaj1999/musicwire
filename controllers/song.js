const staticData = require('../utils/static_data')

module.exports.getAllSongs = (req, res) => {
  return res.render('songs', {
    songs: staticData.songs,
    filterBy: 'all',
    path: '/song',
  })
}

module.exports.getfavoriteSongs = (req, res) => {
  return res.render('songs', {
    songs: staticData.songs.filter((song) => song.isfavorite),
    filterBy: 'favorite',
    path: '/song/favorite',
  })
}

module.exports.togglefavorite = (req, res) => {
  const songId = parseInt(req.body.song_id)
  const backUrl = req.body.back_url
  const song = staticData.songs.find((el) => el.id === songId)
  if (song) {
    song.isfavorite = !song.isfavorite
  }
  return res.redirect(backUrl)
}

module.exports.postDeleteSong = (req, res) => {
  const songId = parseInt(req.body.song_id)
  const backUrl = req.body.back_url
  const songIndex = staticData.songs.findIndex((el) => el.id === songId)
  // if (songIndex !== 1) {
  //   staticData.songs.splice(songIndex, 1)
  // }
  return res.redirect(backUrl)
}
