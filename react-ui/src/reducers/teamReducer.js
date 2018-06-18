import {
  TEAMS_GETALL_BEGIN,
  TEAMS_GETALL_SUCCESS,
  TEAMS_GETALL_FAILURE,
  TEAM_CREATE_BEGIN,
  TEAM_CREATE_SUCCESS,
  TEAM_CREATE_FAILURE,
  TEAM_DELETE_BEGIN,
  TEAM_DELETE_SUCCESS,
  TEAM_DELETE_FAILURE
} from '../actions/teamActions'
import {
  PROJECT_CREATE_SUCCESS
} from '../actions/projectActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  deleting: false,
  error: null
}

const teamReducer = (store = initialState, action) => {
  switch (action.type) {
    case TEAMS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case TEAMS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.teams,
        loading: false,
        error: null
      }
    case TEAMS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case TEAM_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case TEAM_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.newTeam),
        creating: false,
        error: null
      }
    case TEAM_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case TEAM_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case TEAM_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(i => i._id.toString() !== action.payload.deletedTeamId.toString()),
        deleting: false,
        error: null
      }
    case TEAM_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    case PROJECT_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.map(i => {
          const newProject = action.payload.newProject
          if (i._id.toString() === newProject.team._id.toString()) {
            i.projects = i.projects.concat(action.payload.newProject)
          }
          return i
        })
      }
    default:
      return store
  }
}

export default teamReducer