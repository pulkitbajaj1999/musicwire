import {
  setSongs,
  setPublicPlaylists,
  setUserPlaylists,
  setFavorites,
  updatePlaylist,
  setError,
} from './asset'
import axiosClient from '../utils/axiosClient'


export const fetchSongs = () => async (dispatch) => {
  try {
    // Send a request to the server
    const endpoint = '/public/songs'
    const { data } = await axiosClient.get(endpoint)
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
    const endpoint = '/public/playlists'
    const { data } = await axiosClient.get(endpoint)
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
    const endpoint = '/private/playlists'
    const { data } = await axiosClient.get(endpoint, {
      headers: { },
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
    const endpoint = '/private/favorites'
    // Send a request to the server with the credentials
    const { data } = await axiosClient.get(endpoint, {
      headers: {  },
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
      const endpoint = '/private/playlist/addsong'
      const { data } = await axiosClient.post(
        endpoint,
        {
          playlistId: playlistId,
          songId: songId,
        },
        {
          headers: {  },
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
    const endpoint = '/private/favorite/toggle'
    const { data } = await axiosClient.patch(
      endpoint,
      {
        songId: songId,
      },
      {
        headers: { },
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
