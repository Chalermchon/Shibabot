import { Router } from 'express'
import userAPI from './User'

const api = Router()

api.use('/user', userAPI)

export default api