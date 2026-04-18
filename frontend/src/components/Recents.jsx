import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPlaylist } from '../store/asset'

import ListView from './ListView/ListView'

const Recents = () => {
  const assetState = useSelector((state) => state.asset)
  const dispatch = useDispatch()

  const updateCurrentPlaylist = () => {
    dispatch(setCurrentPlaylist(assetState.recents))
  }

  return (
    <ListView
      songs={assetState.recents}
      updateCurrentPlaylist={updateCurrentPlaylist}
    />
  )
}

export default Recents
