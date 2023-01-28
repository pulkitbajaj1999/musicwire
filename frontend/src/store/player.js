import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    disabled: true,
    currentIdx: 0,
    currentSong: null,
    isPlaying: false,
    volume: 70,
  },
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentIdx = 0
      state.currentSong = action.payload
      state.disabled = false
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload
    },
    setVolume: (state, action) => {
      state.volume = action.payload
    },
    toggleDisable: (state, action) => {
      state.disabled = !state.disabled
    },
    setCurrentIdx: (state, action) => {
      state.currentIdx = action.payload
    },
  },
})

export const {
  setCurrentSong,
  setVolume,
  setIsPlaying,
  toggleDisable,
  setCurrentIdx,
} = playerSlice.actions
export default playerSlice.reducer
