/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

const WithRouter = withRouter(({ props: { to, ...props }, children, location }) => (
  <Link
    css={css`
      display: block;
      text-decoration: none;
      padding: 0.25rem;
      color: #000;
      font-size: 0.75rem;
      ${location.pathname === to
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

const Header = ({ logout }) => (
  <header
    css={css`
      display: grid;
      align-items: center;
      justify-items: center;
      grid-template-columns: 4rem 1fr 4rem;
    `}
  >
    <button
      css={css`
        margin: 20px;
        color: white;
        padding: 0;
        background: none;
        border: none;
      `}
      onClick={logout}
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
        <NavLink to="/today">Today</NavLink>
        <NavLink to="/week">This week</NavLink>
        <NavLink to="/later">Later</NavLink>
        <NavLink to="/unprocessed">Unprocessed</NavLink>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  location: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default withRouter(Header);
