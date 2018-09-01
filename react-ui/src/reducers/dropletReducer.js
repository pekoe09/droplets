import {
  DROPLETS_GETFORPROJECT_BEGIN,
  DROPLETS_GETFORPROJECT_SUCCESS,
  DROPLETS_GETFORPROJECT_FAILURE,
  DROPLETS_FIND_BEGIN,
  DROPLETS_FIND_SUCCESS,
  DROPLETS_FIND_FAILURE,
  DROPLET_CREATE_BEGIN,
  DROPLET_CREATE_SUCCESS,
  DROPLET_CREATE_FAILURE,
  DROPLET_UPDATE_BEGIN,
  DROPLET_UPDATE_SUCCESS,
  DROPLET_UPDATE_FAILURE,
  DROPLET_ADD_KEYWORD_BEGIN,
  DROPLET_ADD_KEYWORD_SUCCESS,
  DROPLET_ADD_KEYWORD_FAILURE,
  DROPLET_LINK_BEGIN,
  DROPLET_LINK_SUCCESS,
  DROPLET_LINK_FAILURE
} from '../actions/dropletActions'
import { link } from 'fs';

const initialState = {
  items: [],
  foundDroplets: [],
  loading: false,
  finding: false,
  creating: false,
  updating: false,
  linking: false,
  error: null,
  findError: null,
  linkError: null
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
    case DROPLETS_FIND_BEGIN:
      return {
        ...store,
        finding: true,
        findError: null
      }
    case DROPLETS_FIND_SUCCESS:
      return {
        ...store,
        finding: false,
        findError: null,
        foundDroplets: action.payload.foundDroplets
      }
    case DROPLETS_FIND_FAILURE:
      return {
        ...store,
        finding: false,
        findError: action.payload.error
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
    case DROPLET_ADD_KEYWORD_BEGIN:
      return {
        ...store,
        updating: true
      }
    case DROPLET_ADD_KEYWORD_SUCCESS:
      return {
        ...store,
        updating: false,
        items: store.items.map(i => {
          const updatedDroplet = action.payload.droplet
          const updatedDropletProjects = updatedDroplet.projects.map(p => p.toString())
          if (updatedDropletProjects.includes(i.projectId.toString())) {
            return {
              projectId: i.projectId,
              droplets: i.droplets.map(d =>
                d._id.toString() === updatedDroplet._id.toString() ? updatedDroplet : d
              )
            }
          } else {
            return i
          }
        })
      }
    case DROPLET_LINK_BEGIN:
      return {
        ...store,
        linking: true,
        linkError: null
      }
    case DROPLET_LINK_SUCCESS:
      return {
        ...store,
        linking: false,
        linkError: null,
        items: store.items.map(i => {
          const droplet = action.payload.droplet
          const linkedDroplet = action.payload.linkedDroplet
          const dropletProjects = droplet.projects.map(p => p.toString())
          const linkedDropletProjects = linkedDroplet.projects.map(p => p.toString())
          if (dropletProjects.includes(i.projectId.toString())
            || linkedDropletProjects.includes(i.projectId.toString())) {
            let droplets = i.droplets.map(d => {
              if (d._id.toString() === droplet._id.toString()) {
                return droplet
              }
              else if (d._id.toString() === linkedDroplet._id.toString()) {
                return linkedDroplet
              }
              else {
                return d
              }
            }
            )
            const dropletIds = droplets.map(d => d._id.toString())
            if (!dropletIds.includes(droplet._id.toString())) {
              droplets = droplets.concat(droplet)
            }
            if (!dropletIds.includes(linkedDroplet._id.toString())) {
              droplets = droplets.concat(linkedDroplet)
            }

            return {
              projectId: i.projectId,
              droplets
            }
          } else {
            return i
          }
        })
      }
    case DROPLET_LINK_FAILURE:
      return {
        ...store,
        linking: false,
        linkError: action.payload.error
      }
    default:
      return store
  }
}

export default dropletReducer