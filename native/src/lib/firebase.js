import { today, sunday } from './date.js';
import processTitle from './keywords.js';

/** @typedef {import('@firebase/app-types').FirebaseNamespace} FirebaseNamespace */
/** @typedef {import('@firebase/auth')} FirebaseAuth */
/** @typedef {import('@firebase/firestore')} FirebaseFirestore */

/** @type {FirebaseNamespace} */
// @ts-ignore
// eslint-disable-next-line prefer-destructuring
const firebase = window.firebase;

let settings;

const getSettings = () => {
  const { uid } = firebase.auth().currentUser;
  const db = firebase.firestore();
  db.collection(uid)
    .doc('settings')
    .get()
    .then((doc) => {
      settings = doc.data();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Could not get settings', err);
    });
};

export const init = () => new Promise((resolve, reject) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      resolve(`${user.email} signed in`);
      getSettings();
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
      query = query.where('soft', '<=', today()).where('soft', '>', '""');
      return this;
    },

    week() {
      query = query.where('soft', '<=', sunday()).where('soft', '>', '""');
      return this;
    },

    later() {
      query = query.where('soft', '>', sunday()).where('soft', '<', 'someday');
      return this;
    },

    someday() {
      query = query.where('soft', '>=', 'someday');
      return this;
    },

    unprocessed() {
      query = query.where('soft', '==', '');
      return this;
    },

    search(search) {
      if (search.startsWith('@')) query = query.where('context', '==', search);
      else if (search.startsWith('#')) query = query.where('tags', 'array-contains', search);
      else throw new Error('Not implemented');
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

/**
 * @param {Todo} todo Fully processed todo
 * @param {boolean} [projects] Whether to process projects
 * @returns {{ update: Todo, add?: Todo }} Completed project subtask to add
 */
export const getUpdates = (todo, projects = settings && settings.projects) => {
  const updates = {
    update: { ...todo, ...processTitle(todo.title) },
  };
  const project = /^.+ \/ (.+\n([^ \n@].*))/;
  if (todo.completed && projects && project.test(todo.title)) {
    const match = todo.title.match(project);
    updates.add = {
      ...updates.update,
      title: updates.update.title.match(/(.*)\n/)[1],
    };
    updates.update.title = updates.update.title.replace(match[1], match[2]);
    updates.update.completed = '';
  }
  return updates;
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
      const { update: updateTodo, add: addTodo } = getUpdates(updates);
      if (updateTodo) me.update(updateTodo);
      if (addTodo) add(addTodo);
      return updateTodo;
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
