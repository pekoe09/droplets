import {
  PROJECT_CREATE_BEGIN,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAILURE
} from '../actions/projectActions'

const initialState = {
  creating: false,
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
    default:
      return store
  }
}

export default projectReducer