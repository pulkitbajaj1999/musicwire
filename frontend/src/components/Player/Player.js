import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import Slider from '@mui/material/Slider'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

const pages = ['Products', 'Pricing', 'Blog']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const SONG_IMAGE_SRC =
  'https://c.saavncdn.com/704/Ek-Vari-English-2021-20210813032021-500x500.jpg'

const classes = {
  playerControlBtn: {
    '&:hover': {
      backgroundColor: '#181818',
      border: 'round',
    },
  },
  playerControlIcon: {
    fontSize: '40px',
    color: 'white',
  },
}
function Player(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        height: props.height,
        zIndex: 9999,
        top: `calc(100% - ${props.height})`,
        // top: '85%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#353739',
      }}
    >
      <Container maxWidth="sm" sx={{ width: '10%' }}>
        <img
          src={SONG_IMAGE_SRC}
          style={{ width: '80px', height: '80px' }}
          alt="song"
        />
      </Container>
      <Container sx={{ width: '20%' }}>
        <Typography variant="body1" component="h2">
          Maya Teri Ram
        </Typography>
        <Typography variant="body2" component="h2">
          Shubh
        </Typography>
      </Container>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Container sx={{ width: 'fit-content' }}>
          <IconButton sx={classes.playerControlBtn}>
            <SkipPreviousIcon sx={classes.playerControlIcon} />
          </IconButton>
          <IconButton sx={classes.playerControlBtn}>
            <PlayCircleIcon sx={classes.playerControlIcon} />
          </IconButton>
          <IconButton sx={classes.playerControlBtn}>
            <SkipNextIcon sx={classes.playerControlIcon} />
          </IconButton>
        </Container>
        <Slider
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
      </Container>
      <Container sx={{ width: '20%', display: 'flex', alignItems: 'center' }}>
        <IconButton>
          <VolumeUpIcon sx={{ color: 'white' }} />
        </IconButton>
        <Slider
          size="medium"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
      </Container>
    </AppBar>
  )
}
export default Player
