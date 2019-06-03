/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTags } from './firebase';
import Overlay from './Overlay';

const linkCss = css`
  text-decoration: none;
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  display: block;
  color: #000;
`;

// eslint-disable-next-line react/prop-types
const MenuLink = ({ children, to, close }) => (
  <Link
    css={linkCss}
    to={to}
    onClick={() => {
      if (close) close();
    }}
  >
    {children}
  </Link>
);

const Menu = ({ close, logout, visible }) => {
  const [tags, setTags] = useState(undefined);

  useEffect(() => getTags(setTags), []);

  return (
    visible && (
      <Overlay close={close}>
        <div
          css={css`
            min-height: 100%;
            background: white;
            width: 15rem;
            overflow: auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            & > * {
              padding: 1rem 0.75rem;
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
            Humla App
          </h1>
          <div>
            <MenuLink close={close} to="/today">
              Today
            </MenuLink>
            <MenuLink close={close} to="/week">
              This week
            </MenuLink>
            <MenuLink close={close} to="/later">
              Later
            </MenuLink>
            <MenuLink close={close} to="/someday">
              Someday
            </MenuLink>
            <MenuLink close={close} to="/all">
              All
            </MenuLink>
            <MenuLink close={close} to="/unprocessed">
              Unprocessed
            </MenuLink>
          </div>
          {tags && (
            <div>
              {tags.map(t => (
                <MenuLink key={t} close={close} to={`/all/${t.substring(1)}`}>
                  {t}
                </MenuLink>
              ))}
            </div>
          )}
          <div
            css={css`
              flex: 1;
              border-top: none;
              padding: 0;
            `}
          />
          <div>
            <button
              css={[
                linkCss,
                css`
                  background: none;
                  border: none;
                  cursor: pointer;
                  text-align: left;
                  font-size: 1rem;
                `,
              ]}
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          </div>
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