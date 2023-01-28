import { createSlice } from '@reduxjs/toolkit'

const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    publicPlaylists: [],
    userPlaylists: [],
    songs: [],
    recents: [],
    favorites: [],
    currentPlaylist: [],
    error: null,
  },
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload
    },
    setPublicPlaylists: (state, action) => {
      state.publicPlaylists = action.payload
    },
    setUserPlaylists: (state, action) => {
      state.userPlaylists = action.payload
    },
    setRecents: (state, action) => {
      state.recents = action.payload
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload
    },
    addRecent: (state, action) => {
      const recentSong = action.payload
      const id = recentSong._id
      const index = state.recents.findIndex((song) => song._id === id)
      if (index !== -1) state.recents.splice(index, 1)
      state.recents.unshift(recentSong)
    },
    setError: (state, action) => {
      console.log('__error_in_asset_store__', action.payload)
    },
    updatePlaylist: (state, action) => {
      const updatedPlaylist = action.payload
      state.userPlaylists = state.userPlaylists.map((playlist) => {
        if (playlist._id === updatedPlaylist._id) return updatedPlaylist
        else return playlist
      })
    },
  },
})

export const {
  setSongs,
  setPublicPlaylists,
  setUserPlaylists,
  setRecents,
  setFavorites,
  setCurrentPlaylist,
  addRecent,
  updatePlaylist,
  setError,
} = assetSlice.actions
export default assetSlice.reducer
