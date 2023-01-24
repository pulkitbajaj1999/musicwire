import { configureStore } from '@reduxjs/toolkit'

import authReducer from './auth'
import assetReducer from './asset'
import playerReducer from './player'

const store = configureStore({
  reducer: { auth: authReducer, asset: assetReducer, player: playerReducer },
})

export default store
