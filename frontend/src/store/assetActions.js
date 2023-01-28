import axios from 'axios'
import {
  setSongs,
  setPublicPlaylists,
  setUserPlaylists,
  setFavorites,
  updatePlaylist,
  setError,
} from './asset'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

export const fetchSongs = () => async (dispatch) => {
  try {
    // Send a request to the server
    const { data } = await axios.get(BASE_URL + '/api/public/songs')
    const songs = data.songs ? data.songs : []
    // dispatch action for setting data
    dispatch(setSongs(songs))
  } catch (error) {
    // Extract the error message from the response
    const { msg } = error.response.data

    // Dispatch the setError action
    dispatch(setError(msg))
  }
}

export const fetchPublicPlaylists = (token) => async (dispatch) => {
  try {
    // Send a request to the server
    const { data } = await axios.get(BASE_URL + '/api/public/playlists')
    const playlists = data.playlists ? data.playlists : []
    // dispatch action for setting data
    dispatch(setPublicPlaylists(playlists))
  } catch (error) {
    // Extract the error message from the response
    const { msg } = error.response.data

    // Dispatch the setError action
    dispatch(setError(msg))
  }
}

export const fetchUserPlaylists = (token) => async (dispatch) => {
  try {
    // Send a request to the server with the credentials
    const { data } = await axios.get(BASE_URL + '/api/private/playlists', {
      headers: { authorization: `Bearer ${token}` },
    })
    const playlists = data.playlists ? data.playlists : []
    // dispatch action for setting data
    dispatch(setUserPlaylists(data.playlists))
  } catch (error) {
    // Extract the error message from the response
    const { msg } = error.response.data

    // Dispatch the setError action
    dispatch(setError(msg))
  }
}

export const fetchFavorites = (token) => async (dispatch) => {
  try {
    // Send a request to the server with the credentials
    const { data } = await axios.get(BASE_URL + '/api/private/favorites', {
      headers: { authorization: `Bearer ${token}` },
    })
    const songs = data.songs ? data.songs : []
    // dispatch action for setting data
    dispatch(setFavorites(songs))
  } catch (error) {
    // Extract the error message from the response
    const { msg } = error.response.data

    // Dispatch the setError action
    dispatch(setError(msg))
  }
}

export const addToPlaylist =
  (token, playlistId, songId) => async (dispatch) => {
    try {
      // Send a request to the server with the credentials
      const { data } = await axios.post(
        BASE_URL + '/api/private/playlist/addsong',
        {
          playlistId: playlistId,
          songId: songId,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      if (data?.playlist) dispatch(updatePlaylist(data.playlist))
    } catch (error) {
      // Extract the error message from the response
      const { msg } = error.response.data

      // Dispatch the setError action
      dispatch(setError(msg))
    }
  }

export const toggleFavorite = (token, songId) => async (dispatch) => {
  try {
    // Send a request to the server with the credentials
    const { data } = await axios.patch(
      BASE_URL + '/api/private/favorite/toggle',
      {
        songId: songId,
      },
      {
        headers: { authorization: `Bearer ${token}` },
      }
    )
    if (data?.favorites) dispatch(setFavorites(data.favorites))
  } catch (error) {
    // Extract the error message from the response
    const { msg } = error.response.data

    // Dispatch the setError action
    dispatch(setError(msg))
  }
}
