const albums = [
  {
    id: 19,
    artist: 'AP Dhilon',
    imageUrl: 'albums/ap_dhilon.jpg',
    title: 'album1',
    genre: 'album-genre',
    isfavorite: true,
  },
  {
    id: 20,
    artist: 'Arjit',
    imageUrl: 'albums/arjit.jpeg',
    title: 'album2',
    genre: 'album-genre',
    isfavorite: false,
  },
]
const songs = [
  {
    id: 1,
    title: 'song1-title',
    album: albums[0],
    isfavorite: true,
    fileUrl: 'file-url1',
  },
  {
    id: 2,
    title: 'song2-title',
    album: albums[1],
    isfavorite: false,
    fileUrl: 'file-url1',
  },
]
module.exports = { albums, songs }
