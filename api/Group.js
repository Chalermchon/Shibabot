import { Router } from 'express'
import { groupCol } from '../firebase-admin'

const groupAPI = Router()

groupAPI.get('/:group_id', async (req, res) => {
    const { group_id } = req.params
    try {
        const group = await groupCol.doc(group_id).get()
        return res.status(200).send({
            id: group_id,
            exists: group.exists
        })
    } catch (e) {
        return res.status(500).send('Internal Server Error')
    }
    
})
export default groupAPI