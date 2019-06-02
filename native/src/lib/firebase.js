import { today } from './date.js';
import processTitle from './keywords.js';

/** @typedef {import('@firebase/app-types').FirebaseNamespace} FirebaseNamespace */
/** @typedef {import('@firebase/auth')} FirebaseAuth */
/** @typedef {import('@firebase/firestore')} FirebaseFirestore */

/** @type {FirebaseNamespace} */
// @ts-ignore
// eslint-disable-next-line prefer-destructuring
const firebase = window.firebase;

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
  if ((a.soft || '') < (b.soft || '')) return -1;
  if ((a.soft || '') > (b.soft || '')) return 1;
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

/**
 * @param {import('@firebase/firestore-types').QueryDocumentSnapshot} doc
 * @returns {Todo}
 */
const idMapper = doc => Object.assign({ id: doc.id }, /** @type {Todo} */ (doc.data()));

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

    /**
     * @param {(todos: Todo[]) => any} listener Change listener
     * @returns {() => any} Unsubscribe function
     */
    listen(listener) {
      const unsubscribe = query.onSnapshot((snapshot) => {
        const data = snapshot.docs.map(idMapper);
        listener(data.sort(todoSorter));
      });
      return unsubscribe;
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

/**
 * @param {Todo} todo
 */
export const add = (todo) => {
  /** @type {Todo & {owner: string}} */
  const addable = {
    ...todo,
    ...processTitle(todo.title),
    owner: firebase.auth().currentUser.uid,
  };
  firebase
    .firestore()
    .collection('todos')
    .add(addable);
};

export default firebase;

/** @typedef {import('./types').Todo} Todo */

/**
 * @typedef Context
 * @property {string} context
 * @property {Todo[]} todos
 */
