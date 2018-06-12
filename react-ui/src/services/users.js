import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/users'

const register = async (user) => {
  const response = await axios.post(`${baseUrl}/register`, user)
  return response.data
}

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  if (response.data) {
    localStorage.setItem('dropletsuser', JSON.stringify(response.data))
  }
  return response.data
}

export default {
  login,
  register
}