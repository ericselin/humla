/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTags } from './firebase';
import Overlay from './Overlay';

// eslint-disable-next-line react/prop-types
const MenuLink = ({ children, to }) => (
  <Link
    css={css`
      text-decoration: none;
      margin: 0.5rem 0;
      padding: 0.5rem 0;
      display: block;
      color: #000;
    `}
    to={to}
  >
    {children}
  </Link>
);

const Menu = ({ close, logout, visible }) => {
  const [tags, setTags] = useState(undefined);

  useEffect(() => {
    getTags(setTags);
  }, []);

  return (
    visible && (
      <Overlay close={close}>
        <div
          css={css`
            height: 100%;
            background: white;
            width: 15rem;
            & > * {
              padding: 1rem;
            }
            & > * + * {
              border-top: 1px solid rgba(0, 0, 0, 0.15);
            }
          `}
        >
          <h1
            css={css`
              font-weight: 200;
              font-size: 1.25rem;
              color: rgba(0, 0, 0, 0.9);
              margin: 0;
            `}
          >
            Super Todo
          </h1>
          <div>
            <MenuLink to="/today">Today</MenuLink>
            <MenuLink to="/week">This week</MenuLink>
            <MenuLink to="/later">Later</MenuLink>
            <MenuLink to="/someday">Someday</MenuLink>
            <MenuLink to="/all">All</MenuLink>
          </div>
          <div>
            <MenuLink to="/unprocessed">Unprocessed</MenuLink>
          </div>
          {tags && (
            <div>
              {tags.map(t => (
                <MenuLink key={t} to={`/all/${t.substring(1)}`}>
                  {t}
                </MenuLink>
              ))}
            </div>
          )}
          <button
            css={css`
              margin: 0;
              background: none;
              border: none;
              cursor: pointer;
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
            `}
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </div>
      </Overlay>
    )
  );
};

Menu.propTypes = {
  close: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default Menu;
