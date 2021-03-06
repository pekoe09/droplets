import {
  PROJECTS_GETALL_BEGIN,
  PROJECTS_GETALL_SUCCESS,
  PROJECTS_GETALL_FAILURE,
  PROJECT_CREATE_BEGIN,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAILURE,
  PROJECT_ADD_DROPLET_TO_DESKTOP_BEGIN,
  PROJECT_ADD_DROPLET_TO_DESKTOP_SUCCESS,
  PROJECT_ADD_DROPLET_TO_DESKTOP_FAILURE,
  PROJECT_DELETE_BEGIN,
  PROJECT_DELETE_SUCCESS,
  PROJECT_DELETE_FAILURE
} from '../actions/projectActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  addingDesktopDroplet: false,
  deleting: false,
  error: null,
  addDesktopDropletError: null
}

const projectReducer = (store = initialState, action) => {
  switch (action.type) {
    case PROJECTS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case PROJECTS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.projects,
        loading: false,
        error: null
      }
    case PROJECTS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case PROJECT_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case PROJECT_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.newProject),
        creating: false,
        error: null
      }
    case PROJECT_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case PROJECT_ADD_DROPLET_TO_DESKTOP_BEGIN:
      return {
        ...store,
        addingDesktopDroplet: true,
        addDesktopDropletError: null
      }
    case PROJECT_ADD_DROPLET_TO_DESKTOP_SUCCESS:
      return {
        ...store,
        addingDesktopDroplet: false,
        addDesktopDropletError: null,
        items: store.items.map(i => {
          if (i._id.toString() === action.payload.updatedProject._id.toString()) {
            return action.payload.updatedProject
          } else {
            return i
          }
        })
      }
    case PROJECT_ADD_DROPLET_TO_DESKTOP_FAILURE:
      return {
        ...store,
        addingDesktopDroplet: false,
        addDesktopDropletError: action.payload.error
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