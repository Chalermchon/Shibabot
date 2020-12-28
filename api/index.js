import { Router } from 'express'
import groupAPI from './Group'
import orderAPI from './Order'
import userAPI from './User'

const api = Router()

api.use('/group', groupAPI)
api.use('/user', userAPI)
api.use('/order', orderAPI)

export default api