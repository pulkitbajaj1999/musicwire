// react-libraries
import React, { useState } from 'react'
import { Route, Routes } from 'react-router'

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

// colors : {
//   '#353739',
//   '#181818'
// }

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
  inputFieldName: {
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
            <input hidden accept="image/*" type="file" />
            <EditOutlinedIcon sx={classes.editIcon} />
          </IconButton>
        </Container>
        <Container>
          <TextField
            required
            id="name"
            label="Name"
            variant="outlined"
            sx={classes.inputFieldName}
          />
          <TextField
            id="description"
            label="Description"
            sx={classes.inputFieldDescription}
            multiline
            rows={4}
          />
        </Container>
      </Box>
      <Container sx={{ display: 'flex' }}>
        <Button variant="contained" sx={classes.saveBtn} onClick={props.onSave}>
          Save
        </Button>
      </Container>
    </React.Fragment>
  )
}

const App = () => {
  const [modal, setModal] = useState(null)

  const openCreatePlaylistModal = () => {
    setModal('CREATE_PLAYLIST')
  }
  const closeModalHandler = () => {
    setModal(null)
  }
  const savePlaylistHandler = () => {
    console.log('save')
    closeModalHandler()
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
          onClickCreatePlaylist={openCreatePlaylistModal}
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
