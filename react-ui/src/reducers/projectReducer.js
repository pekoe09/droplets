import {
  PROJECT_CREATE_BEGIN,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAILURE,
  PROJECT_DELETE_BEGIN,
  PROJECT_DELETE_SUCCESS,
  PROJECT_DELETE_FAILURE
} from '../actions/projectActions'

const initialState = {
  creating: false,
  deleting: false,
  error: null
}

const projectReducer = (store = initialState, action) => {
  switch (action.type) {
    case PROJECT_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case PROJECT_CREATE_SUCCESS:
      return {
        ...store,
        creating: false,
        error: null
      }
    case PROJECT_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case PROJECT_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case PROJECT_DELETE_SUCCESS:
      return {
        ...store,
        deleting: false,
        error: null
      }
    case PROJECT_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default projectReducer