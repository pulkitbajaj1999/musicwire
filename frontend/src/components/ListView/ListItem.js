import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRecent, setCurrentPlaylist } from '../../store/asset'
import { addToPlaylist, toggleFavorite } from '../../store/assetActions'
import { setCurrentSong } from '../../store/player'

// third-party libraries
import IconButton from '@mui/material/IconButton'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'

const BASE_URL = process.env.REACT_APP_BASE_URL + ''

const ListItem = (props) => {
  const authState = useSelector((state) => state.auth)
  const assetState = useSelector((state) => state.asset)
  const dispatch = useDispatch()

  // state for storing song is in favorite list
  const [isFavorite, setIsFavorite] = useState(false)

  // determine song is favorite whenever favorites are updated
  useEffect(() => {
    if (assetState.favorites.find((song) => song._id === props.song._id))
      setIsFavorite(true)
    else setIsFavorite(false)
  }, [assetState?.favorites])

  // rendering option menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  // component functions to handle actions
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const addToPlaylistHandler = (playlistId) => {
    const songId = props.song._id
    dispatch(addToPlaylist(authState.token, playlistId, songId))
    handleClose()
  }
  const playSongHandler = () => {
    dispatch(setCurrentSong(props.song))
    dispatch(addRecent(props.song))
    // setting up current playlist
    if (props.updateCurrentPlaylist) {
      props.updateCurrentPlaylist()
    } else {
      dispatch(setCurrentPlaylist([props.song]))
    }
  }

  const favoriteHandler = () => {
    dispatch(toggleFavorite(authState.token, props.song._id))
  }

  const renderMenu = (
    <Menu
      id="song-options-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {assetState?.userPlaylists &&
        assetState.userPlaylists.map((playlist) => (
          <MenuItem
            key={playlist._id}
            onClick={addToPlaylistHandler.bind(null, playlist._id)}
          >
            add to {playlist.title}
          </MenuItem>
        ))}
    </Menu>
  )

  return (
    <TableRow key={props.song._id} hover>
      <TableCell align="center" sx={{ width: '5%' }}>
        <IconButton onClick={playSongHandler}>
          <PlayArrowIcon sx={{ fontSize: '40px' }} />
        </IconButton>
      </TableCell>
      <TableCell align="left" sx={{ width: '8%', padding: 1 }}>
        <img
          src={`${BASE_URL}/${props.song.imageUrl}`}
          style={{ width: '80px', height: '80px' }}
          alt="song"
        />
      </TableCell>
      <TableCell align="left">{props.song.title}</TableCell>
      <TableCell align="left">{props.song.artist}</TableCell>
      <TableCell align="left">
        <IconButton
          onClick={favoriteHandler}
          disabled={!authState.isAuthenticated}
        >
          {isFavorite ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      </TableCell>
      <TableCell align="left">
        <IconButton onClick={handleClick} disabled={!authState.isAuthenticated}>
          <MoreHorizIcon />
        </IconButton>
      </TableCell>
      {renderMenu}
    </TableRow>
  )
}

export default ListItem
