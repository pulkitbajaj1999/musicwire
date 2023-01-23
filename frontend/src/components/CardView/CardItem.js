import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const CardItem = (props) => {
  return (
    <Card
      sx={{
        maxWidth: 250,
        ':hover': {
          boxShadow: 20,
        },
      }}
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
