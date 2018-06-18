import teamService from '../services/teams'

export const TEAMS_GETALL_BEGIN = 'TEAMS_GETALL_BEGIN'
export const TEAMS_GETALL_SUCCESS = 'TEAMS_GETALL_SUCCESS'
export const TEAMS_GETALL_FAILURE = 'TEAMS_GETALL_FAILURE'
export const TEAM_CREATE_BEGIN = 'TEAM_CREATE_BEGIN'
export const TEAM_CREATE_SUCCESS = 'TEAM_CREATE_SUCCESS'
export const TEAM_CREATE_FAILURE = 'TEAM_CREATE_FAILURE'
export const TEAM_DELETE_BEGIN = 'TEAM_DELETE_BEGIN'
export const TEAM_DELETE_SUCCESS = 'TEAM_DELETE_SUCCESS'
export const TEAM_DELETE_FAILURE = 'TEAM_DELETE_FAILURE'

export const getAllTeamsBegin = () => ({
  type: TEAMS_GETALL_BEGIN
})

export const getAllTeamsSuccess = teams => ({
  type: TEAMS_GETALL_SUCCESS,
  payload: { teams }
})

export const getAllTeamsFailure = error => ({
  type: TEAMS_GETALL_FAILURE,
  payload: { error }
})

export const createTeamBegin = () => ({
  type: TEAM_CREATE_BEGIN
})

export const createTeamSuccess = newTeam => ({
  type: TEAM_CREATE_SUCCESS,
  payload: { newTeam }
})

export const createTeamFailure = error => ({
  type: TEAM_CREATE_FAILURE,
  payload: { error }
})

export const deleteTeamBegin = () => ({
  type: TEAM_DELETE_BEGIN
})

export const deleteTeamSuccess = deletedTeamId => ({
  type: TEAM_DELETE_SUCCESS,
  payload: { deletedTeamId }
})

export const deleteTeamFailure = error => ({
  type: TEAM_DELETE_FAILURE,
  payload: { error }
})

export const getAllTeams = () => {
  return async (dispatch) => {
    dispatch(getAllTeamsBegin())
    try {
      const teams = await teamService.getAll()
      dispatch(getAllTeamsSuccess(teams))
    } catch (error) {
      console.log(error)
      dispatch(getAllTeamsFailure(error))
    }
  }
}

export const createTeam = team => {
  return async (dispatch) => {
    dispatch(createTeamBegin())
    try {
      const newTeam = await teamService.create(team)
      dispatch(createTeamSuccess(newTeam))
    } catch (error) {
      console.log(error)
      dispatch(createTeamFailure(error))
    }
  }
}

export const deleteTeam = teamId => {
  return async (dispatch) => {
    dispatch(deleteTeamBegin())
    try {
      const deletedTeamId = await teamService.remove(teamId)
      dispatch(deleteTeamSuccess(deletedTeamId))
    } catch (error) {
      console.log(error)
      dispatch(deleteTeamFailure(error))
    }
  }
}