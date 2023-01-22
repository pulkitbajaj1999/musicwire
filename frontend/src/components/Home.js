import React from 'react'

import CardView from './CardView/CardView'

const ARJIT_IMAGE_SRC =
  'https://hindikhabar.com/wp-content/uploads/2022/04/arijit-singh.jpg'

const static_playlists = [
  {
    _id: '1',
    title: 'Home',
    description: 'arjit',
    isFavourite: true,
    imageUrl: ARJIT_IMAGE_SRC,
  },
  {
    _id: '2',
    title: 'Melody',
    description: 'arjit',
    isFavourite: false,
    imageUrl: ARJIT_IMAGE_SRC,
  },
  {
    _id: '3',
    title: 'Melody',
    description: 'arjit',
    isFavourite: false,
    imageUrl: ARJIT_IMAGE_SRC,
  },
  {
    _id: '4',
    title: 'Melody',
    description: 'arjit',
    isFavourite: true,
    imageUrl: ARJIT_IMAGE_SRC,
  },
  {
    _id: '5',
    title: 'Melody',
    description: 'arjit',
    isFavourite: true,
    imageUrl: ARJIT_IMAGE_SRC,
  },
  {
    _id: '6',
    title: 'Melody',
    description: 'arjit',
    isFavourite: true,
    imageUrl: ARJIT_IMAGE_SRC,
  },
  {
    _id: '7',
    title: 'Melody',
    description: 'arjit',
    isFavourite: true,
    imageUrl: ARJIT_IMAGE_SRC,
  },
]

const Home = () => {
  return <CardView cards={static_playlists} />
}

export default Home
