// react-libraries
import React, { useState, useRef, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

// thirdparty libraries
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'

// custom components
import { checkAuth } from './store/authActions'

import Login from './components/Login'
import TopBar from './components/TopBar'
import Player from './components/Player/Player'
import ResponsiveDrawer from './components/Sidebar'
import NotFound from './components/404/NotFound'
import Modal from './components/UI/Modal'
import Favorites from './components/Favorites'
import Recents from './components/Recents'
import Playlists from './components/Playlists'
import CurrentPlaylist from './components/CurrentPlaylist'
import Home from './components/Home'
import Search from './components/Search'
import PlaylistById from './components/PlaylistById'
import { fetchFavorites, fetchUserPlaylists } from './store/assetActions'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''
const DRAWER_WIDTH = 250
const PLAYER_HEIGHT = '15vh'

const classes = {
  closeIcon: {
    color: 'white',
  },
  editButton: {
    '&:hover': {
      backgroundColor: '#353739',
    },
    borderRadius: 1,
    backgroundColor: '#353739',
    width: '100%',
    height: '100%',
    fontSize: '100px',
    margin: 'auto',
  },
  editIcon: {
    fontSize: '100px',
    color: 'white',
  },
  inputFieldTitle: {
    backgroundColor: '#353739',
    color: 'white',
    marginBottom: 2,
    borderRadius: 1,
    width: '100%',
  },
  inputFieldDescription: {
    backgroundColor: '#353739',
    color: 'white',
    borderRadius: 1,
    width: '100%',
  },
  saveBtn: {
    '&:hover': {
      backgroundColor: 'white',
      transform: 'scale(1.1)',
    },
    marginLeft: 'auto',
    backgroundColor: 'white',
    color: 'black',
  },
}

const CreatePlaylistForm = (props) => {
  const imageFileRef = useRef()
  const titleRef = useRef()
  const descriptionRef = useRef()

  const saveHandler = () => {
    const formBody = new FormData()
    formBody.append(
      'title',
      titleRef.current.querySelector('input#title').value
    )
    formBody.append(
      'description',
      descriptionRef.current.querySelector('textarea#description').value
    )
    formBody.append('imageFile', imageFileRef.current.files[0])
    props.onSave(formBody)
  }

  return (
    <React.Fragment>
      <Container sx={{ display: 'flex', padding: 0 }}>
        <Typography>Add Playlist</Typography>
        <IconButton
          aria-label="delete"
          sx={{ marginLeft: 'auto' }}
          onClick={props.onClose}
        >
          <CloseIcon sx={classes.closeIcon} />
        </IconButton>
      </Container>
      <Box
        sx={{
          display: 'flex',
          paddingLeft: 'auto',
          marginBottom: 2,
        }}
      >
        <Container
          sx={{
            display: 'flex',
          }}
        >
          <IconButton
            color="primary"
            sx={classes.editButton}
            aria-label="upload picture"
            component="label"
          >
            <input hidden accept="image/*" type="file" ref={imageFileRef} />
            <EditOutlinedIcon sx={classes.editIcon} />
          </IconButton>
        </Container>
        <Container>
          <TextField
            required
            id="title"
            label="Title"
            variant="outlined"
            sx={classes.inputFieldTitle}
            ref={titleRef}
          />
          <TextField
            id="description"
            label="Description"
            sx={classes.inputFieldDescription}
            multiline
            rows={4}
            ref={descriptionRef}
          />
        </Container>
      </Box>
      <Container sx={{ display: 'flex' }}>
        <Button variant="contained" sx={classes.saveBtn} onClick={saveHandler}>
          Save
        </Button>
      </Container>
    </React.Fragment>
  )
}

const AddSongForm = (props) => {
  const imageFileRef = useRef()
  const audioFileRef = useRef()
  const titleRef = useRef()
  const artistRef = useRef()
  const descriptionRef = useRef()

  const saveHandler = () => {
    const formBody = new FormData()
    formBody.append(
      'title',
      titleRef.current.querySelector('input#title').value
    )
    formBody.append(
      'artist',
      artistRef.current.querySelector('input#artist').value
    )
    formBody.append(
      'description',
      descriptionRef.current.querySelector('textarea#description').value
    )
    formBody.append('imageFile', imageFileRef.current.files[0])
    formBody.append('audioFile', audioFileRef.current.files[0])
    props.onSave(formBody)
  }

  return (
    <React.Fragment>
      <Container sx={{ display: 'flex', padding: 0 }}>
        <Typography>Add Song</Typography>
        <IconButton
          aria-label="delete"
          sx={{ marginLeft: 'auto' }}
          onClick={props.onClose}
        >
          <CloseIcon sx={classes.closeIcon} />
        </IconButton>
      </Container>
      <Box
        sx={{
          display: 'flex',
          paddingLeft: 'auto',
          marginBottom: 2,
        }}
      >
        <Container>
          <IconButton
            color="primary"
            sx={classes.editButton}
            aria-label="upload picture"
            component="label"
          >
            <input hidden accept="image/*" type="file" ref={imageFileRef} />
            <EditOutlinedIcon sx={classes.editIcon} />
          </IconButton>
        </Container>
        <Container>
          <TextField
            required
            id="title"
            label="Title"
            variant="outlined"
            sx={classes.inputFieldTitle}
            ref={titleRef}
          />
          <TextField
            id="artist"
            label="artist"
            variant="outlined"
            sx={classes.inputFieldTitle}
            ref={artistRef}
          />
          <TextField
            id="description"
            label="Description"
            sx={classes.inputFieldDescription}
            multiline
            rows={3}
            ref={descriptionRef}
          />
        </Container>
      </Box>
      <Container sx={{ display: 'flex' }}>
        <input accept="audio/*" type="file" ref={audioFileRef} />
        <Button variant="contained" sx={classes.saveBtn} onClick={saveHandler}>
          Save
        </Button>
      </Container>
    </React.Fragment>
  )
}

const App = () => {
  const dispatch = useDispatch()
  // fetching auth state
  const authState = useSelector((state) => state.auth)

  // checking authentication and setting user
  useEffect(() => {
    dispatch(checkAuth())
  }, [])

  // fetching user playlists and user favorites when the app loads
  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchUserPlaylists(authState?.token))
      dispatch(fetchFavorites(authState?.token))
    }
  }, [authState.isAuthenticated])

  const [modal, setModal] = useState(null)

  const closeModalHandler = () => {
    setModal(null)
  }
  const savePlaylistHandler = (payload) => {
    const api = BASE_URL + '/api/private/playlist/add'
    axios
      .post(api, payload, {
        headers: {
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        closeModalHandler()
        window.location.reload()
      })
      .catch((err) => {
        console.log('__error_while_adding_playlist__', err)
      })
  }

  const addSongHandler = (payload) => {
    const api = BASE_URL + '/api/admin/song/add'
    axios
      .post(api, payload, {
        headers: {
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        closeModalHandler()
        window.location.reload()
      })
      .catch((err) => {
        console.log('__error_while_adding_song__', err)
      })
  }

  return (
    <React.Fragment>
      {modal === 'CREATE_PLAYLIST' && (
        <Modal onCloseOverlay={closeModalHandler}>
          <CreatePlaylistForm
            onClose={closeModalHandler}
            onSave={savePlaylistHandler}
          />
        </Modal>
      )}
      {modal === 'ADD_SONG' && (
        <Modal onCloseOverlay={closeModalHandler}>
          <AddSongForm onClose={closeModalHandler} onSave={addSongHandler} />
        </Modal>
      )}
      {/* Root Box */}
      <Box
        sx={{
          display: 'flex',
          marginBottom: `calc(${PLAYER_HEIGHT})`,
          minHeight: `calc(100vh - ${PLAYER_HEIGHT})`,
        }}
      >
        {/* left sidebar */}
        <ResponsiveDrawer
          drawerWidth={DRAWER_WIDTH}
          onClickCreatePlaylist={setModal.bind(null, 'CREATE_PLAYLIST')}
          onClickAddSong={setModal.bind(null, 'ADD_SONG')}
        />
        {/* right sidebox */}
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          <TopBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist/:id" element={<PlaylistById />} />
            <Route path="/recents" element={<Recents />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/current" element={<CurrentPlaylist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
      <Player height={PLAYER_HEIGHT} />
    </React.Fragment>
  )
}

export default App
