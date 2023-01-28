import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import ListView from './ListView/ListView'
import { useSelector } from 'react-redux'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const PlaylistById = (props) => {
  const assetState = useSelector((state) => state.asset)
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

  useEffect(() => {
    fetchSongs()
  }, [])

  return <ListView songs={songs} />
}

export default PlaylistById
