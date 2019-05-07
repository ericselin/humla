/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState, Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { auth, authProvider } from './firebase';
import List from './List';
import Header from './Header';
import Settings from './Settings';

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
        {user ? (
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
              <Route path="/settings" component={Settings} />
            </main>
          </Fragment>
        ) : (
          <div
            css={css`
              display: flex;
              height: 100vh;
              align-items: center;
              justify-content: center;
              color: white;
            `}
          >
            {user === undefined && <div>Logging you in...</div>}
            {user === false && (
              <button
                css={css`
                  background: white;
                  border: 1px solid white;
                  padding: 1em 2em;
                  color: #6991c7;
                  font-family: inherit;
                  font-weight: 500;
                  font-size: 1.125rem;
                  letter-spacing: 0.05em;
                  cursor: pointer;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
                `}
                onClick={login}
                type="button"
              >
                Sign in with Google
              </button>
            )}
          </div>
        )}
      </Fragment>
    </Router>
  );
};

export default hot(App);
