import React from 'react'

import ListView from './ListView/ListView'

const ARJIT_IMAGE_SRC =
  'https://hindikhabar.com/wp-content/uploads/2022/04/arijit-singh.jpg'

const SONG_IMAGE_SRC =
  'https://c.saavncdn.com/704/Ek-Vari-English-2021-20210813032021-500x500.jpg'

const STATIC_ALBUM = {
  _id: '1',
  title: 'melody',
  artist: 'arjit',
  isFavorite: true,
  imageUrl: ARJIT_IMAGE_SRC,
}
const STATIC_SONGS = [
  {
    _id: '2',
    title: 'bekhayali-large-large',
    artist: 'arjit',
    album: STATIC_ALBUM,
    imageUrl: SONG_IMAGE_SRC,
    isFavorite: true,
  },
  {
    _id: '3',
    title: 'bekhayali',
    artist: 'arjit',
    album: STATIC_ALBUM,
    imageUrl: SONG_IMAGE_SRC,
    isFavorite: false,
  },
  {
    _id: '4',
    title: 'bekhayali',
    artist: 'arjit',
    album: STATIC_ALBUM,
    imageUrl: SONG_IMAGE_SRC,
    isFavorite: false,
  },
]

const Favorites = () => {
  return <ListView songs={STATIC_SONGS} />
}

export default Favorites
