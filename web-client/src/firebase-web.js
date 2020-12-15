import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyCjoebT1z7CMuSaw5Gv838MFKdQzQ1QQDc",
    authDomain: "shibabot-d4ce2.firebaseapp.com",
    databaseURL: "https://shibabot-d4ce2.firebaseio.com",
    projectId: "shibabot-d4ce2",
    storageBucket: "shibabot-d4ce2.appspot.com",
    messagingSenderId: "1036469804992",
    appId: "1:1036469804992:web:bf3863510f7af7048af225",
    measurementId: "G-DS1MH01ZP2"
})

const firestore = firebase.firestore()
export const userCol = firestore.collection('Users')
export const groupCol = firestore.collection('Groups')