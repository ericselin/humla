import { today } from './date.js';

/** @type {import('@firebase/app') & import('@firebase/auth') & import('@firebase/firestore')} */
// @ts-ignore
const { firebase } = window;

export const waitForAuth = () => new Promise((resolve, reject) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      resolve(`${user.email} signed in`);
    } else {
      reject(new Error('User signed out'));
    }
  });
});

export class Todos {
  constructor() {
    const { uid } = firebase.auth().currentUser;
    /** @type {import('@firebase/firestore-types').Query} */
    this.todos = firebase
      .firestore()
      .collection('todos')
      .where('owner', '==', uid);
  }

  uncompleted() {
    this.todos = this.todos.where('completed', '==', '');
    return this;
  }

  today() {
    this.todos = this.todos.where('soft', '==', today());
    return this;
  }

  async get() {
    const snapshot = await this.todos.get();
    const data = snapshot.docs.map(doc => doc.data());
    return /** @type {Todo[]} */ (data);
  }
}

export default firebase;

/**
 * @typedef Todo
 * @property {string} title
 * @property {boolean} completed
 * @property {string} context
 * @property {string[]} tags
 * @property {string} soft
 */