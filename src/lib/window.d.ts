import firebase from '@firebase/app'
import '@firebase/remote-config'
import '@firebase/auth'
import '@firebase/analytics'
import '@firebase/firestore/dist/packages/firestore/index'

declare global {
  interface Window {
    firebase: typeof firebase
  }
}