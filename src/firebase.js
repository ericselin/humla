import { firebase } from '@firebase/app';

import '@firebase/auth';
import '@firebase/firestore';

// Initialize Firebase
if (firebase.apps.length === 0) {
  console.log('Initializing firebase');
  const config = {
    apiKey: 'AIzaSyA8T1qoF1G2NQ4eN946MDlsEfZFyaoiPNU',
    authDomain: 'super-todo-230614.firebaseapp.com',
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
  let listener = myTodos().where('completed', '==', false);
  // check for filter
  if (where && where.length) {
    // check whether we have many wheres
    if (Array.isArray(where[0])) {
      listener = where.reduce((l, w) => l.where(...w), listener);
    } else {
      listener = listener.where(...where);
    }
  }
  // check for sorting
  if (orderBy) listener = listener.orderBy(orderBy);
  listener = listener.onSnapshot(
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
    listener();
  };
};

export const add = (todo) => {
  todos.add({ ...todo, owner: firebase.auth().currentUser.uid });
};

export const update = (id, updates) => {
  // check if we need to add tags
  const tags = /#\w+/g;
  if (updates.title && tags.test(updates.title)) {
    const match = updates.title.match(tags);
    Object.assign(updates, { tags: match });
  }
  todos.doc(id).update(updates);
  console.log('Updated', id, 'to', updates);
};

export const getTags = (setter) => {
  const tagsMap = {};
  myTodos()
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const todo = doc.data();
        if (todo.tags) {
          todo.tags.forEach((tag) => {
            tagsMap[tag] = tag;
          });
        }
      });
      setter(Object.keys(tagsMap));
    })
    .catch((error) => {
      console.log('Error getting tags: ', error);
    });
};
