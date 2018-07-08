import {
  DROPLET_FILTER_SET
} from '../actions/filterActions'

const initialState = {
  dropletTextFilter: ''
}

const filterReducer = (store = initialState, action) => {
  switch (action.type) {
    case DROPLET_FILTER_SET:
      return {
        ...store,
        dropletTextFilter: action.payload.filterText
      }
    default:
      return store
  }
}

export default filterReducer