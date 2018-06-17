import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/teams'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const create = async (team) => {
  const response = await axios.post(baseUrl, team, getConfig())
  return response.data
}

export default {
  getAll,
  create
}