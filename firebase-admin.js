import admin from 'firebase-admin'

const { SERVICE_ACCOUNT_JSON } = process.env
const firebase = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(SERVICE_ACCOUNT_JSON)),
    databaseURL: "https://shibabot-d4ce2.firebaseio.com",
})
const firestore = firebase.firestore()
export const auth = firebase.auth()
export const FieldValue = admin.firestore.FieldValue
export const userCol = firestore.collection('Users')
export const groupCol = firestore.collection('Groups')