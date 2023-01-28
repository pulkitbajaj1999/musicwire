import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setCurrentSong,
  setVolume,
  setIsPlaying,
  setCurrentIdx,
} from '../../store/player'

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

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const isNumber = (value) => {
  return typeof value === 'number' && isFinite(value)
}

function Player(props) {
  const assetState = useSelector((state) => state.asset)
  const playerState = useSelector((state) => state.player)
  const dispatch = useDispatch()

  const isDisabled = playerState?.disabled
  const isPlaying = playerState?.isPlaying
  const [audio, setAudio] = useState(null)
  const [duration, setDuration] = useState(null)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [progressTime, setProgressTime] = useState(0) // 0 to 100

  // initialize the song from the audio src
  useEffect(() => {
    if (playerState && playerState.currentSong) {
      const currentSong = playerState.currentSong
      const audioElement = new Audio(`${BASE_URL}/${currentSong.audioUrl}`)
      audioElement.volume = playerState.volume / 100
      if (playerState.isPlaying) audioElement.play()
      setAudio(audioElement) // takes <src, volume, loop, autoplay >
      setProgressTime(0)
      // dispatch(setIsPlaying(false))
      audio?.pause()
    }
  }, [playerState?.currentSong])

  // refreshing current-time and progress time each second if song is playing
  useEffect(() => {
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

  const handlePlay = () => {
    console.log('play')
    audio.play()
    dispatch(setIsPlaying(true))
  }
  const handlePause = () => {
    console.log('pause')
    audio.pause()
    dispatch(setIsPlaying(false))
  }
  const handleVolumeChange = (e) => {
    console.log('volume-change', e.target?.value)
    const progressVolume = e.target.value
    dispatch(setVolume(progressVolume))
    audio.volume = progressVolume / 100
  }
  const handleCurrentTimeChange = (e) => {
    console.log('time-change', e.target?.value)
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
    if (playerState.currentIdx === 0) return
    const currentPlaylist = assetState.currentPlaylist
    const size = currentPlaylist.length
    const currentIdx = playerState.currentIdx
    const prevIdx = currentIdx - 1
    dispatch(setCurrentSong(currentPlaylist[prevIdx]))
    dispatch(setCurrentIdx(prevIdx))
  }

  const handleNext = () => {
    console.log('next')
    const currentPlaylist = assetState.currentPlaylist
    const size = currentPlaylist.length
    const currentIdx = playerState.currentIdx
    const nextIdx = (currentIdx + 1) % size
    dispatch(setCurrentSong(currentPlaylist[nextIdx]))
    dispatch(setCurrentIdx(nextIdx))
  }

  // resetting values on song completion
  useEffect(() => {
    if (progressTime === 100) {
      dispatch(setIsPlaying(false))
      handleNext()
      setProgressTime(0)
      setCurrentTime(0)
    }
  }, [progressTime])

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
          src={
            isDisabled
              ? '/no_song.jpg'
              : `${BASE_URL}/${playerState?.currentSong?.imageUrl}`
          }
          style={{ width: '80px', height: '80px' }}
          alt="song"
        />
      </Container>
      <Container sx={{ width: '20%' }}>
        <Typography variant="body1" component="h2">
          {playerState?.currentSong?.title}
        </Typography>
        <Typography variant="body2" component="h2">
          {playerState?.currentSong?.artist}
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
          <IconButton
            sx={classes.playerControlBtn}
            onClick={handlePrevious}
            disabled={isDisabled}
          >
            <SkipPreviousIcon sx={classes.playerControlIcon} />
          </IconButton>
          {!isPlaying && (
            <IconButton
              sx={classes.playerControlBtn}
              onClick={handlePlay}
              disabled={isDisabled}
            >
              <PlayCircleIcon sx={classes.playerControlIcon} />
            </IconButton>
          )}
          {isPlaying && (
            <IconButton
              sx={classes.playerControlBtn}
              onClick={handlePause}
              disabled={isDisabled}
            >
              <PauseOutlinedIcon sx={classes.playerControlIcon} />
            </IconButton>
          )}
          <IconButton
            sx={classes.playerControlBtn}
            onClick={handleNext}
            disabled={isDisabled}
          >
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
          disabled={isDisabled}
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
          value={playerState?.volume}
          onChange={handleVolumeChange}
          disabled={isDisabled}
        />
      </Container>
    </AppBar>
  )
}
export default Player
