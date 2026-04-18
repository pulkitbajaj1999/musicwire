import {
  setToken,
  setUser,
  setIsAuthenticated,
  setError,
  clearError,
} from './auth'
import axiosClient from '../utils/axiosClient'

export const login = (credentials) => async (dispatch) => {
  try {
    // Send a request to the server with the credentials
    let endpoint = '/auth/login'
    const { data } = await axiosClient.post(endpoint, credentials)

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
    const endpoint = '/auth/user'
    const { data } = await axiosClient.get(endpoint, {
      headers: {
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
