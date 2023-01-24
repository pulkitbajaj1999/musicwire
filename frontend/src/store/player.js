import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    disabled: true,
    currentSong: null,
    isPlaying: false,
    volume: 70,
  },
  reducers: {
    setCurrentSong: (state, action) => {
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
  },
})

export const { setCurrentSong, setVolume, setIsPlaying, toggleDisable } =
  playerSlice.actions
export default playerSlice.reducer
