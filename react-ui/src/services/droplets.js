import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/droplets'

const getProjectDroplets = async (projectId) => {
  const response = await axios.get(`${baseUrl}?project=${projectId}`, getConfig())
  return response.data
}

const findDroplets = async (searchText) => {
  const response = await axios.get(`${baseUrl}?searchtext=${searchText}`, getConfig())
  return response.data
}

const create = async (droplet) => {
  const response = await axios.post(baseUrl, droplet, getConfig())
  return response.data
}

const update = async (droplet) => {
  const response = await axios.put(`${baseUrl}/${droplet._id}`, droplet, getConfig())
  return response.data
}

const addKeyword = async (dropletId, keyword) => {
  const response = await axios.put(`${baseUrl}/addkeyword/${dropletId}`, keyword, getConfig())
  return response.data
}

const link = async (dropletId, linkedDropletId) => {
  const response = await axios.put(`${baseUrl}/addlink/${dropletId}`, { linkedDropletId }, getConfig())
  return response.data
}

const remove = async (dropletId) => {
  const response = await axios.delete(`${baseUrl}/${dropletId}`, getConfig())
  return dropletId
}

export default {
  getProjectDroplets,
  findDroplets,
  create,
  update,
  addKeyword,
  link,
  remove
}