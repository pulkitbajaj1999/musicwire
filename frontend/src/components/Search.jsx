import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import axiosClient from '../utils/axiosClient'

import CardView from './CardView/CardView'
import ListView from './ListView/ListView'


const Search = () => {
  // URLSearchParams object
  const [searchParams, setSearchParams] = useSearchParams()

  // assets
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])

  // fetching private data
  useEffect(() => {
    let fetchSongEndpoint = `/public/songs?${searchParams.toString()}`
    axios
      .get(fetchSongEndpoint)
      .then((res) => {
        setSongs(res.data.songs)
      })
      .catch((res) => {
        const { msg } = res.data
      })

    let fetchPlaylistEndpoint =`/public/playlists?${searchParams.toString()}`
    axios
      .get(fetchPlaylistEndpoint)
      .then((res) => {
        setPlaylists(res.data.playlists)
      })
      .catch((res) => {
        const { msg } = res.data
      })
  }, [searchParams])

  return (
    <React.Fragment>
      <ListView songs={songs} />
      <CardView cards={playlists} />
    </React.Fragment>
  )
}

export default Search
