import teamService from '../services/teams'

export const TEAMS_GETALL_BEGIN = 'TEAMS_GETALL_BEGIN'
export const TEAMS_GETALL_SUCCESS = 'TEAMS_GETALL_SUCCESS'
export const TEAMS_GETALL_FAILURE = 'TEAMS_GETALL_FAILURE'
export const TEAM_CREATE_BEGIN = 'TEAM_CREATE_BEGIN'
export const TEAM_CREATE_SUCCESS = 'TEAM_CREATE_SUCCESS'
export const TEAM_CREATE_FAILURE = 'TEAM_CREATE_FAILURE'

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