import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { setCurrentSong } from '../../store/player'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const CardItem = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const setCurrentSongHandler = () => {
    if (props.audioUrl) {
      dispatch(setCurrentSong(props))
    } else {
      navigate(`/playlist/${props._id}`)
    }
  }
  return (
    <Card
      sx={{
        maxWidth: 250,
        ':hover': {
          boxShadow: 20,
        },
      }}
      onClick={setCurrentSongHandler}
    >
      <CardMedia
        component="img"
        alt="album"
        image={`${BASE_URL}/${props.imageUrl}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description ? props.description : 'no-description'}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <IconButton onClick={(e) => console.log('edit')}>
          <EditIcon />
        </IconButton>
      </CardActions> */}
    </Card>
  )
}

export default CardItem
