import { Router } from 'express'
import groupAPI from './Group'
import userAPI from './User'

const api = Router()

api.use('/group', groupAPI)
api.use('/user', userAPI)

export default api