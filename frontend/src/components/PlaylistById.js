import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import { setCurrentPlaylist } from '../store/asset'

import ListView from './ListView/ListView'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const PlaylistById = (props) => {
  const assetState = useSelector((state) => state.asset)
  const dispatch = useDispatch()
  const params = useParams()
  const playlistId = params.id
  const [songs, setSongs] = useState([])

  const fetchSongs = async () => {
    try {
      const { data } = await axios.get(
        BASE_URL + '/api/public/playlist/' + playlistId
      )
      const songs = data?.playlist?.songs
      setSongs(songs)
    } catch (err) {
      console.log('__error_while_fetching_playlist__', err)
    }
  }

  const updateCurrentPlaylist = () => {
    dispatch(setCurrentPlaylist(songs))
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  return (
    <ListView songs={songs} updateCurrentPlaylist={updateCurrentPlaylist} />
  )
}

export default PlaylistById
