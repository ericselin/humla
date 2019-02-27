/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getTags } from './firebase';

const WithRouter = withRouter(({ props: { to, ...props }, children, location }) => (
  <Link
    css={css`
      display: block;
      text-decoration: none;
      padding: 0.25rem;
      color: #000;
      font-size: 0.75rem;
      ${location.pathname.split('/')[1] === to.split('/')[1]
        && css`
          font-size: 1rem;
          color: white;
        `}
    `}
    to={to}
    {...props}
  >
    {children}
  </Link>
));

const NavLink = ({ children, ...props }) => <WithRouter props={props}>{children}</WithRouter>;

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react/prop-types
const MenuLink = ({ children, to }) => (
  <Link
    css={css`
      color: white;
      text-decoration: none;
      margin: 0.5rem;
      padding: 0.5rem;
      display: block;
    `}
    to={to}
  >
    {children}
  </Link>
);

const Header = ({ logout, location }) => {
  const [menu, setMenu] = useState(false);
  const [tags, setTags] = useState(undefined);
  useEffect(() => {
    getTags(setTags);
  }, []);
  const [, view, tag] = location.pathname.split('/');
  return (
    <header
      css={css`
        display: grid;
        align-items: center;
        justify-items: center;
        grid-template-columns: 4rem 1fr 4rem;
      `}
    >
      {menu && (
        <div
          css={css`
            position: fixed;
            top: 68px;
            bottom: 0;
            width: 100px;
            background: rgba(0, 0, 0, 0.3);
          `}
        >
          <MenuLink to={`/${view}`}>All</MenuLink>
          {tags && tags.map(t => <MenuLink key={tag} to={`/${view}/${t.substring(1)}`}>{t}</MenuLink>)}
          <button
            css={css`
              margin: 20px;
              color: white;
              padding: 0;
              background: none;
              border: none;
              cursor: pointer;
              position: absolute;
              bottom: 0;
            `}
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </div>
      )}
      <button
        css={css`
          margin: 20px;
          color: white;
          padding: 0;
          background: none;
          border: none;
          cursor: pointer;
        `}
        onClick={() => setMenu(m => !m)}
        type="button"
      >
        <i className="material-icons">menu</i>
      </button>
      <div>
        <div
          css={css`
            display: grid;
            grid-auto-flow: column;
            gap: 1rem;
          `}
        >
          <NavLink to={`/today${tag ? `/${tag}` : ''}`}>Today</NavLink>
          <NavLink to={`/week${tag ? `/${tag}` : ''}`}>This week</NavLink>
          <NavLink to={`/later${tag ? `/${tag}` : ''}`}>Later</NavLink>
          <NavLink to={`/someday${tag ? `/${tag}` : ''}`}>Someday</NavLink>
          <NavLink to={`/all${tag ? `/${tag}` : ''}`}>All</NavLink>
          <NavLink to="/unprocessed">Unprocessed</NavLink>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  location: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default withRouter(Header);
