import React from 'react'
import { useSelector } from 'react-redux'

import ListView from './ListView/ListView'

const CurrentPlaylist = () => {
  const assetState = useSelector((state) => state.asset)
  return <ListView songs={assetState.current} />
}

export default CurrentPlaylist
