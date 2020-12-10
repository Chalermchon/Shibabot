import { Router } from 'express'
import lineWebhook from './LINE'

const webhook = Router()

webhook.use('/line', lineWebhook)

export default webhook