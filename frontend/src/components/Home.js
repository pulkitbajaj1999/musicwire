import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSongs, fetchPublicPlaylists } from '../store/assetActions'

import CardView from './CardView/CardView'

const Home = () => {
  const assetState = useSelector((state) => state.asset)
  const dispatch = useDispatch()

  // fetching private data
  useEffect(() => {
    dispatch(fetchSongs())
    dispatch(fetchPublicPlaylists())
  }, [])

  return (
    <React.Fragment>
      <CardView cards={assetState.publicPlaylists} />
      <CardView cards={assetState.songs} />
    </React.Fragment>
  )
}

export default Home
