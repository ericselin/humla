import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import firebase from './firebase';
import List from './List';
import './App.css';
import Header from './Header';
import Unprocessed from './Unprocessed';

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
    <Router>
      <React.Fragment>
        {user && (
          <React.Fragment>
            <Header logout={logout} selectView={selectView} />
            <main className="content">
              <Route exact path="/" component={List} />
              <Route path="/unprocessed" component={Unprocessed} />
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
    </Router>
  );
};

export default App;
