import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axiosClient from '../utils/axiosClient'

import { setCurrentPlaylist } from '../store/asset'

import ListView from './ListView/ListView'


const PlaylistById = (props) => {
  const assetState = useSelector((state) => state.asset)
  const dispatch = useDispatch()
  const params = useParams()
  const playlistId = params.id
  const [songs, setSongs] = useState([])

  const fetchSongs = async () => {
    try {
      let endpoint = `/public/playlist/${playlistId}`
      const { data } = await axiosClient.get(endpoint)
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
