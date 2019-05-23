import { today } from './date.js';
import processTitle from './keywords.js';

/** @type {import('@firebase/app') & import('@firebase/auth') & import('@firebase/firestore')} */
// @ts-ignore
const { firebase } = window;

export const waitForAuth = () => new Promise((resolve, reject) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      resolve(`${user.email} signed in`);
    } else {
      reject(new Error('User signed out, trying to sign in now'));
      const authProvider = new firebase.auth.GoogleAuthProvider();
      if (window.innerWidth <= 768) {
        firebase.auth().signInWithRedirect(authProvider);
      } else {
        firebase.auth().signInWithPopup(authProvider);
      }
    }
  });
});

/**
 * @param {Todo} a
 * @param {Todo} b
 * @returns {number}
 */
export const todoSorter = (a, b) => {
  if ((a.context || '') > (b.context || '')) return -1;
  if ((a.context || '') < (b.context || '')) return 1;
  if ((a.soft || '') > (b.soft || '')) return -1;
  if ((a.soft || '') < (b.soft || '')) return 1;
  return 0;
};

/**
 * @param {Object<string, Todo[]>} obj
 * @param {Todo} t
 * @returns {Object<string, Todo[]>}
 */
export const contextReducer = (obj, t) => {
  /* eslint-disable no-param-reassign */
  const context = t.context || 'no context';
  if (obj[context]) {
    obj[context].push(t);
  } else {
    obj[context] = [t];
  }
  return obj;
  /* eslint-enable */
};

export const todos = () => {
  const { uid } = firebase.auth().currentUser;
  /** @type {import('@firebase/firestore-types').Query} */
  let query = firebase
    .firestore()
    .collection('todos')
    .where('owner', '==', uid);

  return {
    uncompleted() {
      query = query.where('completed', '==', '');
      return this;
    },

    today() {
      query = query.where('soft', '==', today());
      return this;
    },

    async get() {
      const snapshot = await query.get();
      /** @type {Todo[]} */
      // @ts-ignore
      const data = snapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
      return data.sort(todoSorter);
    },
  };
};

export const doc = (id) => {
  const me = firebase
    .firestore()
    .collection('todos')
    .doc(id);
  return {
    /**
     * @param {Todo} updates
     * @returns {Todo}
     */
    update(updates) {
      const processedUpdates = Object.assign(updates, processTitle(updates.title));
      me.update(processedUpdates);
      return processedUpdates;
    },
  };
};

export default firebase;

/** @typedef {import('./types').Todo} Todo */

/**
 * @typedef Context
 * @property {string} context
 * @property {Todo[]} todos
 */
