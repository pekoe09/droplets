import dropletService from '../services/droplets'

export const DROPLETS_GETFORPROJECT_BEGIN = 'DROPLETS_GETFORPROJECT_BEGIN'
export const DROPLETS_GETFORPROJECT_SUCCESS = 'DROPLETS_GETFORPROJECT_SUCCESS'
export const DROPLETS_GETFORPROJECT_FAILURE = 'DROPLETS_GETFORPROJECT_FAILURE'
export const DROPLET_CREATE_BEGIN = 'DROPLET_CREATE_BEGIN'
export const DROPLET_CREATE_SUCCESS = 'DROPLET_CREATE_SUCCESS'
export const DROPLET_CREATE_FAILURE = 'DROPLET_CREATE_FAILURE'
export const DROPLET_UPDATE_BEGIN = 'DROPLET_UPDATE_BEGIN'
export const DROPLET_UPDATE_SUCCESS = 'DROPLET_UPDATE_SUCCESS'
export const DROPLET_UPDATE_FAILURE = 'DROPLET_UPDATE_FAILURE'

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

export const updateDropletBegin = () => ({
  type: DROPLET_UPDATE_BEGIN
})

export const updateDropletSuccess = (updatedDroplet, projectId) => ({
  type: DROPLET_UPDATE_SUCCESS,
  payload: {
    updatedDroplet,
    projectId
  }
})

export const updateDropletFailure = error => ({
  type: DROPLET_UPDATE_FAILURE,
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

export const saveDroplet = droplet => {
  return async (dispatch) => {
    if (!droplet._id) {
      dispatch(createDropletBegin())
      try {
        const newDroplet = await dropletService.create(droplet)
        dispatch(createDropletSuccess(newDroplet, droplet.projectId))
      } catch (error) {
        console.log(error)
        dispatch(createDropletFailure(error))
      }
    } else {
      dispatch(updateDropletBegin())
      try {
        const updatedDroplet = await dropletService.update(droplet)
        dispatch(updateDropletSuccess(updatedDroplet, droplet.projectId))
      } catch (error) {
        console.log(error)
        dispatch(updateDropletFailure(error))
      }
    }
  }
}