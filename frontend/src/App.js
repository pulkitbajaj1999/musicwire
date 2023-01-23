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

const BASE_URL = process.env.REACT_APP_BASE_URL || ''
const DRAWER_WIDTH = 250

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

const App = () => {
  const dispatch = useDispatch()
  // fetching auth state
  const authState = useSelector((state) => state.auth)

  // checking authentication and setting user
  useEffect(() => {
    dispatch(checkAuth())
  }, [])

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
      <Box sx={{ display: 'flex', marginBottom: '15vh' }}>
        <ResponsiveDrawer
          drawerWidth={DRAWER_WIDTH}
          onClickCreatePlaylist={setModal.bind(null, 'CREATE_PLAYLIST')}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          <TopBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/recents" element={<Recents />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/current" element={<CurrentPlaylist />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
      <Player height={'15vh'} />
    </React.Fragment>
  )
}

export default App
