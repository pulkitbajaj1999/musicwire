import React from 'react'

// third-party libraries
import IconButton from '@mui/material/IconButton'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const ListItem = (props) => {
  return (
    <TableRow key={props._id} hover>
      <TableCell align="center" sx={{ width: '5%' }}>
        <IconButton onClick={props.onClickPlay.bind(null, props._id)}>
          <PlayArrowIcon sx={{ fontSize: '40px' }} />
        </IconButton>
      </TableCell>
      <TableCell align="left" sx={{ width: '8%', padding: 1 }}>
        <img
          src={props.imageUrl}
          style={{ width: '80px', height: '80px' }}
          alt="song"
        />
      </TableCell>
      <TableCell align="left">{props.title}</TableCell>
      <TableCell align="left">{props.artist}</TableCell>
      <TableCell align="left">
        <IconButton onClick={props.onClickFavorite.bind(null, props._id)}>
          {props.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default ListItem
