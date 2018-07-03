import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/droplets'

const getProjectDroplets = async (projectId) => {
  const response = await axios.get(`${baseUrl}?project=${projectId}`, getConfig())
  return response.data
}

const create = async (droplet) => {
  const response = await axios.post(baseUrl, droplet, getConfig())
  return response.data
}

const remove = async (dropletId) => {
  const response = await axios.delete(`${baseUrl}/${dropletId}`, getConfig())
  return dropletId
}

export default {
  getProjectDroplets,
  create,
  remove
}