// Firebase App is always required and must be first
const firebase = require('firebase/app');

// Add additional services that you want to use
require('firebase/auth');
require('firebase/firestore');

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyA8T1qoF1G2NQ4eN946MDlsEfZFyaoiPNU',
  authDomain: 'super-todo-230614.firebaseapp.com',
  databaseURL: 'https://super-todo-230614.firebaseio.com',
  projectId: 'super-todo-230614',
  storageBucket: 'super-todo-230614.appspot.com',
  messagingSenderId: '804405641493',
};
firebase.initializeApp(config);

const db = firebase.firestore();

db.enablePersistence().catch((err) => {
  console.warn('Could not enable persistence', err);
});

export default firebase;

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

export const unprocessed = setter => () => {
  console.info('Adding query snapshot listener...');
  return myTodos()
    .where('soft', '==', null)
    .where('completed', '==', false)
    .onSnapshot(snapshotListener(setter));
};

export const list = setter => () => {
  console.log('Adding query snapshot listener...');
  return myTodos()
    .orderBy('completed')
    .orderBy('soft')
    .onSnapshot(snapshotListener(setter));
};

export const add = (todo) => {
  myTodos().add(todo);
};
