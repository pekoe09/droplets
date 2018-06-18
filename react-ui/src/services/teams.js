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

const remove = async (teamId) => {
  console.log('Remove service called')
  const response = await axios.delete(`${baseUrl}/${teamId}`, getConfig())
  return teamId
}

export default {
  getAll,
  create,
  remove
}