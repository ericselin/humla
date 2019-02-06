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

firebase
  .firestore()
  .enablePersistence()
  .catch((err) => {
    console.warn('Could not enable persistence', err);
  });

export default firebase;

export const myTodos = () => {
  const { uid } = firebase.auth().currentUser;
  const db = firebase.firestore();
  return db.collection('todos').where('owner', '==', uid);
};
