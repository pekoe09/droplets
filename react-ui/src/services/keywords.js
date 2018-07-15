import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/keywords'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const create = async (keyword) => {
  const response = await axios.post(baseUrl, keyword, getConfig())
  return response.data
}

const update = async (keyword) => {
  const response = await axios.put(`${baseUrl}/${keyword._id}`, keyword, getConfig())
  return response.data
}

const remove = async (keywordId) => {
  const response = await axios.delete(`${baseUrl}/${keywordId}`, getConfig())
  return keywordId
}

export default {
  getAll,
  create,
  update,
  remove
}