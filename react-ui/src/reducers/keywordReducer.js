import {
  KEYWORDS_GETALL_BEGIN,
  KEYWORDS_GETALL_SUCCESS,
  KEYWORDS_GETALL_FAILURE,
  KEYWORD_CREATE_BEGIN,
  KEYWORD_CREATE_SUCCESS,
  KEYWORD_CREATE_FAILURE
} from '../actions/keywordActions'
import {
  DROPLET_ADD_KEYWORD_SUCCESS
} from '../actions/dropletActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  error: null
}

const keywordReducer = (store = initialState, action) => {
  switch (action.type) {
    case KEYWORDS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case KEYWORDS_GETALL_SUCCESS:
      return {
        ...store,
        loading: false,
        error: null,
        items: action.payload.keywords
      }
    case KEYWORDS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case KEYWORD_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case KEYWORD_CREATE_SUCCESS:
      return {
        ...store,
        creating: false,
        error: null,
        items: items.concat(action.payload.newKeyword)
      }
    case KEYWORD_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case DROPLET_ADD_KEYWORD_SUCCESS:
      const candidateKeyword = action.payload.keyword
      const existingKeyword = items.find(i => i._id.toString() === candidateKeyword._id.toString())
      if (!existingKeyword) {
        return {
          ...store,
          items: items.concat(candidateKeyword)
        }
      } else {
        return store
      }
    default:
      return store
  }
}

export default keywordReducer