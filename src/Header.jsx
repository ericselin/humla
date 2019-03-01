/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Menu from './Menu';

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

const Header = ({ logout, location }) => {
  const [menu, setMenu] = useState(false);
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
      <Menu close={() => setMenu(false)} logout={logout} visible={menu} />
      <button css={button} onClick={() => setMenu(m => !m)} type="button">
        <i className="material-icons">menu</i>
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
