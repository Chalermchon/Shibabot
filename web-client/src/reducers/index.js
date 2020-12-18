import { combineReducers } from 'redux'
import userReducer from './User'
import uiReducer from './UI'

const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
})

export default rootReducer