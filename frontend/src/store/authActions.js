import axios from 'axios'
import {
  setToken,
  setUser,
  setIsAuthenticated,
  setError,
  clearError,
} from './auth'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

export const login = (credentials) => async (dispatch) => {
  try {
    // Send a request to the server with the credentials
    const { data } = await axios.post(BASE_URL + '/api/auth/login', credentials)

    // Extract the token and user from the response
    const { token, user } = data

    // Save the token in the local storage
    localStorage.setItem('token', token)

    // Dispatch the setToken, setUser and setIsAuthenticated actions
    dispatch(setToken(token))
    dispatch(setUser(user))
    dispatch(setIsAuthenticated(true))
  } catch (error) {
    // Extract the error message from the response
    const { msg } = error.response.data

    // Dispatch the setError action
    dispatch(setError(msg))
  }
}

export const logout = () => (dispatch) => {
  // Remove the token from the local storage
  localStorage.removeItem('token')

  // Dispatch the setToken, setUser, setIsAuthenticated and clearError actions
  dispatch(setToken(null))
  dispatch(setUser(null))
  dispatch(setIsAuthenticated(false))
  dispatch(clearError())
}

export const checkAuth = () => async (dispatch) => {
  try {
    // Get the token from the local storage
    const token = localStorage.getItem('token')
    if (!token) return
    // Send a request to the server to check the authentication
    const api = BASE_URL + '/api/auth/user'
    const { data } = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Extract the user from the response
    const { user } = data

    // Dispatch the setToken, setUser and setIsAuthenticated actions
    dispatch(setToken(token))
    dispatch(setUser(user))
    dispatch(setIsAuthenticated(true))
  } catch (error) {
    const { msg } = error.response.data
    // Dispatch the setError action
    dispatch(setError(msg))
  }
}
