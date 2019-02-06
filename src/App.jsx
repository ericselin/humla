import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import List from './List';

const login = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  if (window.innerWidth <= 768) {
    firebase.auth().signInWithRedirect(provider);
  } else {
    firebase.auth().signInWithPopup(provider);
  }
};

const logout = () => {
  firebase.auth().signOut();
};

const App = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => firebase.auth().onAuthStateChanged((u) => {
    if (u) {
      console.info('User signed in', u);
      setUser(u);
    } else {
      console.info('User signed out');
      setUser(false);
    }
  }), []);

  return (
    <div>
      {user && (
        <React.Fragment>
          <button onClick={logout} type="button">
            Logout
          </button>
          <List />
        </React.Fragment>
      )}
      {user === undefined && <div>Loading...</div>}
      {user === false && (
        <button onClick={login} type="button">
          Login
        </button>
      )}
    </div>
  );
};

export default App;
