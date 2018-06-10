import userService from '../services/users'

const userReducer = (store = [], action) => {
  switch (action.type) {
    case 'REGISTER_USER':
      return store.concat(action.newUser)
    default:
      return store
  }
}

export const register = (user) => {
  return async (dispatch) => {
    const newUser = await userService.register(user)
    dispatch({
      type: 'REGISTER_USER',
      newUser
    })
  }
}

export default userReducer