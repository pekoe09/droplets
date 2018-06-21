import moment from 'moment'

const uiMessageReducer = (store = [], action) => {
  switch (action.type) {
    case 'ADD_UIMESSAGE':
      return store.concat(action.newUIMessage)
    case 'CLEAR_UIMESSAGE':
      return store.filter(m => m.content !== action.content)
    default:
      return store
  }
}

export const addUIMessage = (content, type, timeout) => {
  return async (dispatch) => {
    const timestamp = new moment()
    await dispatch({
      type: 'ADD_UIMESSAGE',
      newUIMessage: { content, type, timestamp }
    })
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_UIMESSAGE',
        content,
        timestamp
      })
    }, timeout * 1000)
  }
}

export default uiMessageReducer