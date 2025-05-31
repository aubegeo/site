import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator} from 'firebase/firestore'
import { defineNuxtPlugin } from 'nuxt/app'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: 'AIzaSyCIecCebxdrXADZxweXiA4WnliWBbmYJPs',
    authDomain: 'tabletteprixcom.firebaseapp.com',
    projectId: 'tabletteprixcom',
    storageBucket: 'tabletteprixcom.appspot.com',
    messagingSenderId: '826919349065',
    appId: '1:826919349065:web:0bcef1f224c7ae74adc898',
    measurementId: 'G-M3DR3H04J8'
  }

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  const db = getFirestore(app)
   // Si on est en développement local, on connecte l'émulateur Firestore
   if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(db, 'localhost', 8080)
  }

  const storage = getStorage(app)

  return {
    provide: {
      db,
      storage
    }
  }
}
)