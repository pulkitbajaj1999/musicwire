import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserPlaylists } from '../store/assetActions'

import CardView from './CardView/CardView'

const Playlists = () => {
  const authState = useSelector((state) => state.auth)
  const assetState = useSelector((state) => state.asset)
  const dispatch = useDispatch()

  return <CardView cards={assetState.userPlaylists} />
}

export default Playlists
