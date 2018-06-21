import userService from '../services/users'

export const REGISTER_USER_BEGIN = 'REGISTER_USER_BEGIN'
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE'
export const LOGIN_BEGIN = 'LOGIN_BEGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_BEGIN = 'LOGOUT_BEGIN'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

export const registerUserBegin = () => ({
  type: REGISTER_USER_BEGIN
})

export const registerUserSuccess = newUser => ({
  type: REGISTER_USER_SUCCESS,
  payload: { newUser }
})

export const registerUserError = error => ({
  type: REGISTER_USER_FAILURE,
  payload: { error }
})

export const loginBegin = () => ({
  type: LOGIN_BEGIN
})

export const loginSuccess = currentUser => ({
  type: LOGIN_SUCCESS,
  payload: { currentUser }
})

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: { error }
})

export const logoutBegin = () => ({
  type: LOGOUT_BEGIN
})

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS
})

export const logoutFailure = error => ({
  type: LOGOUT_FAILURE
})

export const register = (user) => {
  return async (dispatch) => {
    dispatch(registerUserBegin())
    try {
      const newUser = await userService.register(user)
      dispatch(registerUserSuccess(newUser))
    } catch (exception) {
      console.log(exception)
      dispatch(registerUserError(exception))
    }
  }
}

export const login = (credentials) => {
  return async (dispatch) => {
    dispatch(loginBegin())
    try {
      const currentUser = await userService.login(credentials)
      dispatch(loginSuccess(currentUser))
    } catch (exception) {
      console.log(exception)
      dispatch(loginFailure(exception))
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    dispatch(logoutBegin())
    try {
      userService.logout()
      dispatch(logoutSuccess())
    } catch (exception) {
      console.log(exception)
      dispatch(logoutFailure(exception))
    }
  }
}