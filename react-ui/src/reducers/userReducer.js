import {
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE
} from '../actions/userActions'

const initialState = {
  items: [],
  currentUser: null,
  registering: false,
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
    default:
      return store
  }
}

export default userReducer