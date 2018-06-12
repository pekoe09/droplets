import {
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../actions/userActions'

const initialState = {
  items: [],
  currentUser: null,
  registering: false,
  loggingIn: false,
  error: null
}

const userReducer = (store = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER_BEGIN:
      return {
        ...store,
        registering: true,
        error: null
      }
    case REGISTER_USER_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.newUser),
        registering: false,
        error: null
      }
    case REGISTER_USER_FAILURE:
      return {
        ...store,
        registering: false,
        error: action.payload.error
      }
    case LOGIN_BEGIN:
      return {
        ...store,
        loggingIn: true,
        error: null
      }
    case LOGIN_SUCCESS:
      return {
        ...store,
        currentUser: action.payload.currentUser,
        loggingIn: false,
        error: false
      }
    case LOGIN_FAILURE:
      return {
        ...store,
        currentUser: null,
        loggingIn: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default userReducer