import { today } from "./date.js";

/** @type {import('@firebase/app') & import('@firebase/auth') & import('@firebase/firestore')} */
// @ts-ignore
const { firebase } = window;

export const waitForAuth = () =>
  new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(`${user.email} signed in`);
      } else {
        reject(new Error("User signed out, trying to sign in now"));
        const authProvider = new firebase.auth.GoogleAuthProvider();
        if (window.innerWidth <= 768) {
          firebase.auth().signInWithRedirect(authProvider);
        } else {
          firebase.auth().signInWithPopup(authProvider);
        }
      }
    });
  });

export const todos = () => {
  const { uid } = firebase.auth().currentUser;
  /** @type {import('@firebase/firestore-types').Query} */
  let query = firebase
    .firestore()
    .collection("todos")
    .where("owner", "==", uid);

  return {
    uncompleted() {
      query = query.where("completed", "==", "");
      return this;
    },

    today() {
      query = query.where("soft", "==", today());
      return this;
    },

    async get() {
      const snapshot = await query.get();
      const data = snapshot.docs.map(doc =>
        Object.assign({ id: doc.id }, doc.data())
      );
      return /** @type {Todo[]} */ (data);
    }
  };
};

export const doc = id => {
  const me = firebase
    .firestore()
    .collection("todos")
    .doc(id);
  return {
    /**
     * @param {Todo} updates
     */
    update(updates) {
      return me.update(updates);
    }
  };
};

export default firebase;

/**
 * @typedef Todo
 * @property {string} title
 * @property {string} completed
 * @property {string} context
 * @property {string[]} tags
 * @property {string} soft
 * @property {string} id
 */
