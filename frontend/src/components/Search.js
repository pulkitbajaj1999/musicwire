import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'

import CardView from './CardView/CardView'
import ListView from './ListView/ListView'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const Search = () => {
  // URLSearchParams object
  const [searchParams, setSearchParams] = useSearchParams()

  // assets
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])

  // fetching private data
  useEffect(() => {
    axios
      .get(BASE_URL + `/api/public/songs?${searchParams.toString()}`)
      .then((res) => {
        setSongs(res.data.songs)
      })
      .catch((res) => {
        const { msg } = res.data
      })
    axios
      .get(BASE_URL + `/api/public/playlists?${searchParams.toString()}`)
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
