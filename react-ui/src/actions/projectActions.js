import projectService from '../services/projects'

export const PROJECTS_GETALL_BEGIN = 'PROJECTS_GETALL_BEGIN'
export const PROJECTS_GETALL_SUCCESS = 'PROJECTS_GETALL_SUCCESS'
export const PROJECTS_GETALL_FAILURE = 'PROJECTS_GETALL_FAILURE'
export const PROJECT_CREATE_BEGIN = 'PROJECT_CREATE_BEGIN'
export const PROJECT_CREATE_SUCCESS = 'PROJECT_CREATE_SUCCESS'
export const PROJECT_CREATE_FAILURE = 'PROJECT_CREATE_FAILURE'
export const PROJECT_ADD_DROPLET_TO_DESKTOP_BEGIN = 'PROJECT_ADD_DROPLET_TO_DESKTOP_BEGIN'
export const PROJECT_ADD_DROPLET_TO_DESKTOP_SUCCESS = 'PROJECT_ADD_DROPLET_TO_DESKTOP_SUCCESS'
export const PROJECT_ADD_DROPLET_TO_DESKTOP_FAILURE = 'PROJECT_ADD_DROPLET_TO_DESKTOP_FAILURE'
export const PROJECT_DELETE_BEGIN = 'PROJECT_DELETE_BEGIN'
export const PROJECT_DELETE_SUCCESS = 'PROJECT_DELETE_SUCCESS'
export const PROJECT_DELETE_FAILURE = 'PROJECT_DELETE_FAILURE'

export const getAllProjectsBegin = () => ({
  type: PROJECTS_GETALL_BEGIN
})

export const getAllProjectsSuccess = projects => ({
  type: PROJECTS_GETALL_SUCCESS,
  payload: { projects }
})

export const getAllProjectsFailure = error => ({
  type: PROJECTS_GETALL_FAILURE,
  payload: { error }
})

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

export const addDropletToDesktopBegin = () => ({
  type: PROJECT_ADD_DROPLET_TO_DESKTOP_BEGIN
})

export const addDropletToDesktopSuccess = updatedProject => ({
  type: PROJECT_ADD_DROPLET_TO_DESKTOP_SUCCESS,
  payload: { updatedProject }
})

export const addDropletToDesktopFailure = error => ({
  type: PROJECT_ADD_DROPLET_TO_DESKTOP_FAILURE,
  payload: { error }
})

export const deleteProjectBegin = () => ({
  type: PROJECT_DELETE_BEGIN
})

export const deleteProjectSuccess = deletedProjectId => ({
  type: PROJECT_DELETE_SUCCESS,
  payload: { deletedProjectId }
})

export const deleteProjectFailure = error => ({
  type: PROJECT_DELETE_FAILURE,
  payload: { error }
})

export const getAllProjects = () => {
  return async (dispatch) => {
    dispatch(getAllProjectsBegin())
    try {
      const projects = await projectService.getAll()
      dispatch(getAllProjectsSuccess(projects))
    } catch (error) {
      console.log(error)
      dispatch(getAllProjectsFailure(error))
    }
  }
}

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

export const addDropletToDesktop = (desktopDroplet) => {
  return async (dispatch) => {
    dispatch(addDropletToDesktopBegin())
    try {
      const updatedProject = await projectService.addDropletToDesktop(desktopDroplet)
      console.log('Action received project', updatedProject)
      dispatch(addDropletToDesktopSuccess(updatedProject))
    } catch (error) {
      console.log(error)
      dispatch(addDropletToDesktopFailure(error))
    }
  }
}

export const deleteProject = projectId => {
  return async (dispatch) => {
    dispatch(deleteProjectBegin())
    try {
      const deletedProjectId = await projectService.remove(projectId)
      dispatch(deleteProjectSuccess(deletedProjectId))
    } catch (error) {
      console.log(error)
      dispatch(deleteProjectFailure(error))
    }
  }
}