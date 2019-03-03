/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState, Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { auth, authProvider } from './firebase';
import List from './List';
import Header from './Header';

export const login = () => {
  console.log('Logging in');
  if (window.innerWidth <= 768) {
    auth.signInWithRedirect(authProvider);
  } else {
    auth.signInWithPopup(authProvider);
  }
};

export const logout = () => {
  auth.signOut();
};

const App = () => {
  const [user, setUser] = useState(undefined);
  let cancel = false;

  useEffect(() => {
    console.info('Adding auth state listener...');
    const listener = auth.onAuthStateChanged(
      (u) => {
        if (cancel) {
          console.warn('Auth state canceled');
          return;
        }
        if (u) {
          console.info('User signed in', u);
          setUser(u);
        } else {
          console.info('User signed out');
          setUser(false);
        }
      },
      (error) => {
        console.error('Could not sign in', error);
      },
      () => {
        console.warn('Auth state listener removed');
      },
    );
    return () => {
      console.info('Removing auth state listener...');
      cancel = true;
      listener();
    };
  }, []);

  return (
    <Router>
      <Fragment>
        {user && (
          <Fragment>
            <Header logout={logout} />
            <main
              css={css`
                padding: 0 20px 20px;
                margin: auto;
                max-width: 700px;
              `}
            >
              <Route exact path="/" render={() => <Redirect to="/today" />} />
              <Route path="/today" component={List} />
              <Route path="/week" component={List} />
              <Route path="/later" component={List} />
              <Route path="/someday" component={List} />
              <Route path="/all" component={List} />
              <Route path="/unprocessed" component={List} />
            </main>
          </Fragment>
        )}
        {user === undefined && <div>Loading...</div>}
        {user === false && (
          <button onClick={login} type="button">
            Login
          </button>
        )}
      </Fragment>
    </Router>
  );
};

export default App;
