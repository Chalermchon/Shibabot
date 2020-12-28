import { combineReducers } from 'redux'
import uiReducer from './UI'
import userReducer from './User'
import productsReducer from './Products'
import ordersReducer from './Orders'
import neighborsReducer from './Neighbors'

const rootReducer = combineReducers({
    ui: uiReducer,
    user: userReducer,
    products: productsReducer,
    orders: ordersReducer,
    neighbors: neighborsReducer,
})

export default rootReducer