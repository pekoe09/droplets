import projectService from '../services/projects'

export const PROJECT_CREATE_BEGIN = 'PROJECT_CREATE_BEGIN'
export const PROJECT_CREATE_SUCCESS = 'PROJECT_CREATE_SUCCESS'
export const PROJECT_CREATE_FAILURE = 'PROJECT_CREATE_FAILURE'

export const createProjectBegin = () => ({
  type: PROJECT_CREATE_BEGIN
})

export const createProjectSuccess = newProject => ({
  type: PROJECT_CREATE_SUCCESS,
  payload: { newProject }
})

export const createProjectFailure = error => ({
  type: PROJECT_CREATE_FAILURE,
  payload: { error }
})

export const createProject = project => {
  return async (dispatch) => {
    dispatch(createProjectBegin())
    try {
      const newProject = await projectService.create(project)
      dispatch(createProjectSuccess(newProject))
    } catch (error) {
      console.log(error)
      dispatch(createProjectFailure(error))
    }
  }
}