import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSongs, fetchPublicPlaylists } from '../store/assetActions'

import CardView from './CardView/CardView'
import ListView from './ListView/ListView'

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
      <ListView songs={assetState.songs} />
      <CardView cards={assetState.publicPlaylists} />
    </React.Fragment>
  )
}

export default Home
