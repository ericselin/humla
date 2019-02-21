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

const db = firebase.firestore();
export const auth = firebase.auth();
export const authProvider = new firebase.auth.GoogleAuthProvider();

const myTodos = () => {
  const { uid } = firebase.auth().currentUser;
  return db.collection(uid);
};

const snapshotListener = setter => (querySnapshot) => {
  console.info('Incoming query snapshot', querySnapshot);
  const t = {};
  querySnapshot.forEach((doc) => {
    t[doc.id] = doc.data();
  });
  setter(t);
};

export const list = ({ setTodos, where: [field, operand, value], orderBy }) => () => {
  console.log('Adding query snapshot listener...', field, operand, value);
  let listener = myTodos()
    .where('completed', '==', false)
    .where(field, operand, value);
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
  myTodos().add(todo);
};

export const update = (id, updates) => {
  myTodos()
    .doc(id)
    .update(updates);
  console.log('Updated', id, 'to', updates);
};
