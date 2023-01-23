import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFavorites } from '../store/assetActions'

import ListView from './ListView/ListView'

const Favorites = () => {
  const authState = useSelector((state) => state.auth)
  const assetState = useSelector((state) => state.asset)
  const dispatch = useDispatch()
  // fetching private data
  useEffect(() => {
    if (authState.token) dispatch(fetchFavorites(authState.token))
  }, [authState.token])

  return <ListView songs={assetState.favorites} />
}

export default Favorites
