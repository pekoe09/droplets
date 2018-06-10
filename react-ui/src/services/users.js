import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/users'

const register = async (user) => {
  const response = await axios.post(baseUrl, user)
  return response.data
}

export default {
  register
}