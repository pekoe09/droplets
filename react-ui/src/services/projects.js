import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/projects'

const create = async (project) => {
  const response = await axios.post(baseUrl, project, getConfig())
  return response.data
}

export default {
  create
}