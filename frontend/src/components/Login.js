import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/authActions'
import { clearError } from '../store/auth'

import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Row from '@mui/material/TableRow'
import Col from '@mui/material/TableCell'

// const BASE_URL = process.env.REACT_APP_BASE_URL || ''
// const BACKGROUND_SRC =
//   'https://thumbs.dreamstime.com/b/d-icon-music-player-blue-violet-neon-notes-isolated-black-background-140031611.jpg'

const BACKGROUND_SRC = '/login_page_bg.jpeg'
const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },

  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
})

const Login = () => {
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log('auth-state', authState)
  const handleSubmit = (event) => {
    event.preventDefault()
    const formBody = new FormData(event.currentTarget)
    dispatch(login(formBody))
  }

  // display error
  useEffect(() => {
    if (authState && authState.error) {
      alert(authState.error)
      dispatch(clearError())
    }
  }, authState.error)

  // if authenticated navigate to home
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [authState.isAuthenticated])

  return (
    <Box
      className="content mainContent"
      // sx={{ backgroundColor: '#353739', height: '100vh', width: '100vw' }}
      sx={{
        backgroundImage: `url(${BACKGROUND_SRC})`,
        backgroundPosition: 'right',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        flex: 1,
        padding: '4rem 8rem',
      }}
    >
      <Row>
        <Col sx={{ borderBottom: 'none' }} md={6}>
          <div className="login-section">
            <div className="login-form">
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <CssTextField
                  id="email"
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <CssTextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, height: '55px', fontSize: '20px' }}
                >
                  LOGIN
                </Button>
              </Box>
            </div>
          </div>
        </Col>
      </Row>
    </Box>
  )
}

export default Login
