import React from 'react'

// import third-party libraries
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// import custom components
import CardItem from './CardItem'

const Playlist = (props) => {
  const cards = props.cards
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={6} sx={{ padding: 8 }}>
        {cards.map((card, i) => (
          <Grid key={card._id} item xl={3}>
            <CardItem {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Playlist
