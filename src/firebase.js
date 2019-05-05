import { firebase } from '@firebase/app';

import '@firebase/auth';
import '@firebase/firestore';
import { getDate } from './date';

// Initialize Firebase
if (firebase.apps.length === 0) {
  console.log('Initializing firebase');
  const config = {
    apiKey: 'AIzaSyA8T1qoF1G2NQ4eN946MDlsEfZFyaoiPNU',
    authDomain: 'www.humla.app',
    databaseURL: 'https://super-todo-230614.firebaseio.com',
    projectId: 'super-todo-230614',
    storageBucket: 'super-todo-230614.appspot.com',
    messagingSenderId: '804405641493',
  };
  firebase.initializeApp(config);

  console.log('Enabling persistence...');
  firebase
    .firestore()
    .enablePersistence()
    .then(() => {
      console.log('Enabled persistence');
    })
    .catch((err) => {
      console.warn('Could not enable persistence', err);
    });
}

const todos = firebase.firestore().collection('todos');

export const auth = firebase.auth();
export const authProvider = new firebase.auth.GoogleAuthProvider();

const myTodos = () => {
  const { uid } = firebase.auth().currentUser;
  return todos.where('owner', '==', uid);
};

const snapshotListener = setter => (querySnapshot) => {
  console.info('Incoming query snapshot', querySnapshot);
  const t = {};
  querySnapshot.forEach((doc) => {
    t[doc.id] = doc.data();
  });
  setter(t);
};

export const list = ({ setTodos, where, orderBy }) => () => {
  console.log('Adding query snapshot listener...', where);
  let query = myTodos();
  // check for filter
  if (where && where.length) {
    // check whether we have many wheres
    if (Array.isArray(where[0])) {
      query = where.reduce((l, w) => l.where(...w), query);
    } else {
      query = query.where(...where);
    }
  }
  // check for sorting
  if (orderBy) query = query.orderBy(orderBy);
  const unsubscribe = query.onSnapshot(
    snapshotListener(setTodos),
    (error) => {
      console.error(error);
    },
    () => {
      console.log('Query snapshot listener completion');
    },
  );
  return () => {
    console.log('Removing query snapshot listener...');
    unsubscribe();
  };
};

const processUpdates = (originalUpdates) => {
  const updates = Object.assign({}, originalUpdates);
  if (updates.title) {
    // check if we need to add tags
    const tags = /#\w+/g;
    Object.assign(updates, { tags: updates.title.match(tags) });
    // check for context
    const context = /@\w+/;
    const match = updates.title.match(context);
    Object.assign(updates, { context: match ? match[0] : null });
    // check for date
    const dateRegex = /\B!(\w+\.?\w*)\b/;
    const dateMatch = updates.title.match(dateRegex);
    if (dateMatch) {
      const [, dateStr] = dateMatch;
      const date = getDate(dateStr);
      updates.title = updates.title.replace(dateRegex, '');
      Object.assign(updates, { soft: date });
    }
  }

  // check special formatted dates
  if (updates.soft) {
    const soft = getDate(updates.soft);
    Object.assign(updates, { soft });
  }

  return updates;
};

export const add = (todo) => {
  const t = processUpdates(todo);
  todos.add({ ...t, owner: firebase.auth().currentUser.uid });
};

export const update = (id, updates) => {
  const u = processUpdates(updates);
  todos.doc(id).update(u);
  console.log('Updated', id, 'to', u);
  return u;
};

export const getTags = setter => myTodos()
  .where('completed', '==', '')
  .onSnapshot((querySnapshot) => {
    const tagsMap = {};
    querySnapshot.forEach((doc) => {
      const todo = doc.data();
      if (todo.tags) {
        todo.tags.forEach((tag) => {
          tagsMap[tag] = tag;
        });
      }
    });
    const tags = Object.keys(tagsMap).sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
    console.log('New tags:', tags.join(', '));
    setter(tags);
  });
