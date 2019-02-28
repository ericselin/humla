/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTags } from './firebase';

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

const Menu = ({ close, logout, visible }) => {
  const [tags, setTags] = useState(undefined);

  useEffect(() => {
    getTags(setTags);
  }, []);

  return (
    visible && (
      <div
        css={css`
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.3);
        `}
        onClick={close}
      >
        <MenuLink to="/all">All</MenuLink>
        {tags
          && tags.map(t => (
            <MenuLink key={t} to={`/all/${t.substring(1)}`}>
              {t}
            </MenuLink>
          ))}
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
    )
  );
};

Menu.propTypes = {
  close: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default Menu;
