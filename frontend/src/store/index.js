import { configureStore } from '@reduxjs/toolkit'

import authReducer from './auth'
import assetReducer from './asset'

const store = configureStore({
  reducer: { auth: authReducer, asset: assetReducer },
})

export default store
