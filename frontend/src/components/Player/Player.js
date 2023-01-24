import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Slider from '@mui/material/Slider'
import IconButton from '@mui/material/IconButton'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeMuteIcon from '@mui/icons-material/VolumeMute'

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

const SONG_IMAGE_SRC =
  'https://c.saavncdn.com/704/Ek-Vari-English-2021-20210813032021-500x500.jpg'

const SONG_AUDIO_SRC =
  'https://hanzluo.s3-us-west-1.amazonaws.com/music/wuyuwuqing.mp3'

const DEFAULT_VOLUME = 10

const isNumber = (value) => {
  return typeof value === 'number' && isFinite(value)
}

function Player(props) {
  const assetState = useSelector((state) => state.asset)

  const [audio, setAudio] = useState(null)
  const [duration, setDuration] = useState(null)
  const [isPlaying, setIsPlaying] = useState(null)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [progressTime, setProgressTime] = useState(0) // 0 to 100
  const [progressVolume, setProgressVolume] = useState(DEFAULT_VOLUME) // 0 to 100

  // initialize the song from the audio src
  useEffect(() => {
    const audioElement = new Audio(SONG_AUDIO_SRC)
    audioElement.volume = DEFAULT_VOLUME / 100
    setAudio(audioElement) // takes <src, volume, loop, autoplay >
    setIsPlaying(false)
    audio?.pause()
  }, [])

  // refreshing current-time and progress time each second if song is playing
  useEffect(() => {
    console.log('----------use-effect--------')
    if (audio && isNumber(audio.duration) && isPlaying) {
      const interval = setInterval(() => {
        console.log('----updating-progress-time-----')
        setDuration(audio.duration)
        setCurrentTime(audio?.currentTime)
        setProgressTime((audio?.currentTime / audio?.duration) * 100)
      }, 1000)
      return () => clearTimeout(interval)
    }
  }, [audio, isPlaying])

  // resetting values on song completion
  useEffect(() => {
    if (progressTime === 100) {
      setIsPlaying(false)
      setProgressTime(0)
      setCurrentTime(0)
    }
  }, [progressTime])

  const handlePlay = () => {
    console.log('play')
    audio.play()
    setIsPlaying(true)
  }
  const handlePause = () => {
    console.log('pause')
    audio.pause()
    setIsPlaying(false)
  }
  const handleVolumeChange = (e) => {
    console.log('volume-change', e.target?.value)
    const progressVolume = e.target.value
    setProgressVolume(progressVolume)
    audio.volume = progressVolume / 100
  }
  const handleCurrentTimeChange = (e) => {
    console.log('time-change', e.target?.value)
    console.log('duration', duration)
    // check if song duration is present
    if (isNaN(duration)) return
    const currentTime = (e.target.value / 100) * duration
    setProgressTime(e.target.value)
    setCurrentTime(currentTime)
    audio.currentTime = currentTime
  }

  const handleToggleMute = () => {
    audio.muted = !muted
    setMuted((muted) => !muted)
  }

  const handlePrevious = () => {
    console.log('prev')
  }

  const handleNext = () => {
    console.log('next')
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
        {/* player main controls */}
        <Container sx={{ width: 'fit-content' }}>
          <IconButton sx={classes.playerControlBtn} onClick={handlePrevious}>
            <SkipPreviousIcon sx={classes.playerControlIcon} />
          </IconButton>
          {!isPlaying && (
            <IconButton sx={classes.playerControlBtn} onClick={handlePlay}>
              <PlayCircleIcon sx={classes.playerControlIcon} />
            </IconButton>
          )}
          {isPlaying && (
            <IconButton sx={classes.playerControlBtn} onClick={handlePause}>
              <PauseOutlinedIcon sx={classes.playerControlIcon} />
            </IconButton>
          )}
          <IconButton sx={classes.playerControlBtn} onClick={handleNext}>
            <SkipNextIcon sx={classes.playerControlIcon} />
          </IconButton>
        </Container>
        {/* player progress bar */}
        <Slider
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
          value={progressTime}
          onChange={handleCurrentTimeChange}
        />
      </Container>
      {/* player volume controls */}
      <Container sx={{ width: '20%', display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleToggleMute}>
          {!muted && <VolumeUpIcon sx={{ color: 'white' }} />}
          {muted && <VolumeMuteIcon sx={{ color: 'white' }} />}
        </IconButton>
        <Slider
          size="medium"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
          value={progressVolume}
          onChange={handleVolumeChange}
        />
      </Container>
    </AppBar>
  )
}
export default Player
