import express from 'express'
import cors from 'cors'
import path from 'path'
import chalk from 'chalk'
import { logger } from './middleware'
import api from './api'
import webhook from './webhook'

const { PORT } = process.env

const app = express()
const port = PORT || 5000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'web-client/build')))
app.use(logger)

app.use('/api', api)
app.use('/webhook', webhook)
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/web-client/build/index.html'))
})

app.listen(port, () => { console.log(
    chalk.hex('#63BF27').bold('🌈 Shibabot Server is listening on port:'),
    chalk.hex('#D2DE6A').bold(port)
)})