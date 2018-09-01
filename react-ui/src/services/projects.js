import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/projects'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const create = async (project) => {
  const response = await axios.post(baseUrl, project, getConfig())
  return response.data
}

const addDropletToDesktop = async (desktopDroplet) => {
  const response = await axios.put(`${baseUrl}/adddroplettodesktop`, desktopDroplet, getConfig())
  return response.data
}

const remove = async (projectId) => {
  const response = await axios.delete(`${baseUrl}/${projectId}`, getConfig())
  return projectId
}

export default {
  getAll,
  create,
  addDropletToDesktop,
  remove
}