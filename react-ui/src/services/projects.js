import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/projects'

const create = async (project) => {
  const response = await axios.post(baseUrl, project, getConfig())
  return response.data
}

const remove = async (projectId) => {
  const response = await axios.delete(`${baseUrl}/${projectId}`, getConfig())
  return projectId
}

export default {
  create,
  remove
}