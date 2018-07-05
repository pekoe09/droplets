import {
  DROPLETS_GETFORPROJECT_BEGIN,
  DROPLETS_GETFORPROJECT_SUCCESS,
  DROPLETS_GETFORPROJECT_FAILURE,
  DROPLET_CREATE_BEGIN,
  DROPLET_CREATE_SUCCESS,
  DROPLET_CREATE_FAILURE,
  DROPLET_UPDATE_BEGIN,
  DROPLET_UPDATE_SUCCESS,
  DROPLET_UPDATE_FAILURE
} from '../actions/dropletActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  error: null
}

const dropletReducer = (store = initialState, action) => {
  switch (action.type) {
    case DROPLETS_GETFORPROJECT_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case DROPLETS_GETFORPROJECT_SUCCESS: {
      return {
        ...store,
        // possible earlier version of project droplets are removed and current version added
        items: store.items
          .filter(i => i.projectId.toString() !== action.payload.projectId.toString())
          .concat({
            projectId: action.payload.projectId,
            droplets: action.payload.droplets
          }),
        loading: false,
        error: null
      }
    }
    case DROPLETS_GETFORPROJECT_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case DROPLET_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case DROPLET_CREATE_SUCCESS: {
      return {
        ...store,
        items: store.items.map(i => {
          if (i.projectId.toString() === action.payload.projectId.toString()) {
            return {
              projectId: i.projectId,
              droplets: i.droplets.concat(action.payload.newDroplet)
            }
          } else {
            return i
          }
        }),
        loading: false,
        error: null
      }
    }
    case DROPLET_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case DROPLET_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case DROPLET_UPDATE_SUCCESS:
      return {
        ...store,
        items: store.items.map(i => {
          const updatedDroplet = action.payload.updatedDroplet
          if (i.projectId.toString() === action.payload.projectId.toString()) {
            return {
              projectId: i.projectId,
              droplets: i.droplets.map(d => d._id.toString() === updatedDroplet._id.toString() ? updatedDroplet : d)
            }
          } else {
            return i
          }
        }),
        updating: false,
        error: null
      }
    case DROPLET_UPDATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default dropletReducer