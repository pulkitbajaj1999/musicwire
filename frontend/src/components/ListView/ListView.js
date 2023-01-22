import React from 'react'

// third-party libraries
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// custom react components
import ListItem from './ListItem'

const classes = {
  tableHeadCell: { fontWeight: 'bold' },
}

const ListView = (props) => {
  const playSongHandler = (id) => {
    console.log('song-to-play', id)
  }

  const toggleFavoriteSong = (id) => {
    console.log('toggle', id)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell sx={classes.tableHeadCell} align="center"></TableCell>
            <TableCell sx={classes.tableHeadCell} align="left"></TableCell>
            <TableCell sx={classes.tableHeadCell} align="left">
              Title
            </TableCell>
            <TableCell sx={classes.tableHeadCell} align="left">
              Artist
            </TableCell>
            <TableCell sx={classes.tableHeadCell} align="left">
              Favourite
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.songs.map((songs) => (
            <ListItem
              key={songs._id}
              {...songs}
              onClickPlay={playSongHandler}
              onClickFavorite={toggleFavoriteSong}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ListView
