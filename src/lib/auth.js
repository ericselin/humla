/** @typedef {import('@firebase/app-types').FirebaseNamespace} FirebaseNamespace */
/** @typedef {import('@firebase/auth')} FirebaseAuth */
/** @typedef {import('@firebase/firestore')} FirebaseFirestore */
/** @typedef {import('@firebase/analytics')} FirebaseAnalytics */
/** @typedef {import('@firebase/remote-config')} FirebaseRemoteConfig */

/** @type {FirebaseNamespace} */
// @ts-ignore
// eslint-disable-next-line prefer-destructuring
const firebase = window.firebase;

// check if we want to set the channel
if (window.location.hash === '#beta') {
  firebase.analytics().setUserProperties({ channel: 'beta' });
}
if (window.location.hash === '#stable') {
  firebase.analytics().setUserProperties({ channel: '' });
}

/**
 * Sign in the user
 *
 * @returns {Promise<any>}
 */
export const signIn = async () => {
  let promise;
  const authProvider = new firebase.auth.GoogleAuthProvider();
  if (window.innerWidth <= 768) {
    promise = firebase.auth().signInWithRedirect(authProvider);
  } else {
    promise = firebase.auth().signInWithPopup(authProvider);
  }
  await promise;
};

/**
 * Sign the user out
 *
 * @returns {Promise<any>}
 */
export const signOut = async () => {
  await firebase.auth().signOut();
};

let authenticated;
/**
 * Returns promise of whether the user is signed in or not
 *
 * @returns {Promise<boolean>}
 */
export const isAuth = () => {
  if (typeof authenticated === 'undefined') {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        authenticated = !!user;
        resolve(authenticated);
      });
    });
  }
  return authenticated;
};

let authPromise;
/**
 * Wait for a promise that resolves once the user is signed in.
 *
 * @returns {Promise<any>}
 */
const auth = async () => {
  if (!authPromise) {
    authPromise = new Promise((resolve) => {
      const unsub = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
          firebase.analytics().logEvent('login');
          unsub();
        }
      });
    });
  }
  return authPromise;
};
export default auth;
