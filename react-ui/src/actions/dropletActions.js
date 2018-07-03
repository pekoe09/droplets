import dropletService from '../services/droplets'

export const DROPLETS_GETFORPROJECT_BEGIN = 'DROPLETS_GETFORPROJECT_BEGIN'
export const DROPLETS_GETFORPROJECT_SUCCESS = 'DROPLETS_GETFORPROJECT_SUCCESS'
export const DROPLETS_GETFORPROJECT_FAILURE = 'DROPLETS_GETFORPROJECT_FAILURE'
export const DROPLET_CREATE_BEGIN = 'DROPLET_CREATE_BEGIN'
export const DROPLET_CREATE_SUCCESS = 'DROPLET_CREATE_SUCCESS'
export const DROPLET_CREATE_FAILURE = 'DROPLET_CREATE_FAILURE'

export const getDropletsForProjectBegin = () => ({
  type: DROPLETS_GETFORPROJECT_BEGIN
})

export const getDropletsForProjectSuccess = (droplets, projectId) => ({
  type: DROPLETS_GETFORPROJECT_SUCCESS,
  payload: {
    droplets,
    projectId
  }
})

export const getDropletsForProjectFailure = error => ({
  type: DROPLETS_GETFORPROJECT_FAILURE,
  payload: { error }
})

export const createDropletBegin = () => ({
  type: DROPLET_CREATE_BEGIN
})

export const createDropletSuccess = (newDroplet, projectId) => ({
  type: DROPLET_CREATE_SUCCESS,
  payload: {
    newDroplet,
    projectId
  }
})

export const createDropletFailure = error => ({
  type: DROPLET_CREATE_FAILURE,
  payload: { error }
})

export const getDropletsForProject = projectId => {
  return async (dispatch) => {
    dispatch(getDropletsForProjectBegin())
    try {
      const droplets = await dropletService.getProjectDroplets(projectId)
      dispatch(getDropletsForProjectSuccess(droplets, projectId))
    } catch (error) {
      console.log(error)
      dispatch(getDropletsForProjectFailure(error))
    }
  }
}

export const createDroplet = droplet => {
  return async (dispatch) => {
    dispatch(createDropletBegin())
    try {
      const newDroplet = await dropletService.create(droplet)
      dispatch(createDropletSuccess(newDroplet, droplet.projectId))
    } catch (error) {
      console.log(error)
      dispatch(createDropletFailure(error))
    }
  }
}