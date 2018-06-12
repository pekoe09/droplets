import userService from '../services/users'

export const REGISTER_USER_BEGIN = 'REGISTER_USER_BEGIN'
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE'

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

export const register = (user) => {
  return async (dispatch) => {
    dispatch(registerUserBegin())
    console.log('Reducer registering')
    try {
      const newUser = await userService.register(user)
      console.log('Reducer registered', newUser)
      dispatch(registerUserSuccess(newUser))
    } catch (exception) {
      console.log(exception)
      dispatch(registerUserError(exception))
    }
  }
}

