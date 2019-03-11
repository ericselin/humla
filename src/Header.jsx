/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Menu from './Menu';
import New from './New';
import IconMenu from './icons/menu.svg';
import IconAdd from './icons/add.svg';

const viewNames = {
  today: 'Today',
  week: 'This week',
  later: 'Later',
  someday: 'Someday',
  all: 'All',
  unprocessed: 'Unprocessed',
};

const button = css`
  margin: 20px;
  color: white;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const icon = css`
  fill: white;
`;

const Header = ({ logout, location, history }) => {
  const [menu, setMenu] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [, view, tag] = location.pathname.split('/');

  useEffect(() => {
    const listener = (e) => {
      if (e.altKey) {
        switch (e.key) {
          case 'n':
            setNewVisible(true);
            break;
          case 't':
            history.push('/today');
            break;
          case 'w':
            history.push('/week');
            break;
          case 'l':
            history.push('/later');
            break;
          case 's':
            history.push('/someday');
            break;
          case 'a':
            history.push('/all');
            break;
          case 'u':
            history.push('/unprocessed');
            break;
          default:
            break;
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  });

  return (
    <header
      css={css`
        display: grid;
        align-items: center;
        justify-items: center;
        grid-template-columns: 4rem 1fr 4rem;
      `}
    >
      <Menu close={() => setMenu(false)} logout={logout} visible={menu} />
      <button css={button} onClick={() => setMenu(m => !m)} type="button">
        <IconMenu css={icon} />
      </button>
      <div
        css={css`
          color: white;
          font-size: 1.25rem;
          font-weight: 200;
        `}
      >
        {tag ? `#${tag}` : viewNames[view] || view}
      </div>
      <button css={button} onClick={() => setNewVisible(true)} type="button">
        <IconAdd css={icon} />
      </button>
      <New close={() => setNewVisible(false)} visible={newVisible} />
    </header>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  location: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Header);
