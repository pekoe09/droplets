import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import dropletReducer from './reducers/dropletReducer'
import projectReducer from './reducers/projectReducer'
import teamReducer from './reducers/teamReducer'
import uiMessageReducer from './reducers/uiMessageReducer'
import userReducer from './reducers/userReducer'

const appReducer = combineReducers({
  droplets: dropletReducer,
  projects: projectReducer,
  teams: teamReducer,
  uiMessages: uiMessageReducer,
  users: userReducer
})

export const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_SUCCESS') {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`)
    })
    state = undefined
  }
  return appReducer(state, action)
}

export const persistConfig = {
  key: 'droplets',
  storage,
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
)

export const persistor = persistStore(store)