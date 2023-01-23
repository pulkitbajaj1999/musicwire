import React from 'react'
import { useSelector } from 'react-redux'

import ListView from './ListView/ListView'

const Recents = () => {
  const assetState = useSelector((state) => state.asset)
  return <ListView songs={assetState.recents} />
}

export default Recents
