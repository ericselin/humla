import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import List from './List';
import './App.css';

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

  useEffect(
    () => firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        console.info('User signed in', u);
        setUser(u);
      } else {
        console.info('User signed out');
        setUser(false);
      }
    }),
    [],
  );

  const selectView = () => {
    // todo: open view selector here
    // todo: create view selector
  };

  return (
    <React.Fragment>
      {user && (
        <React.Fragment>
          <header>
            <button onClick={logout} type="button" className="menu-btn">
              <i className="material-icons">menu</i>
            </button>
            <div>
              <button onClick={selectView} type="button">Main</button>
            </div>
          </header>
          <main className="content">
            <List />
          </main>
        </React.Fragment>
      )}
      {user === undefined && <div>Loading...</div>}
      {user === false && (
        <button onClick={login} type="button">
          Login
        </button>
      )}
    </React.Fragment>
  );
};

export default App;
