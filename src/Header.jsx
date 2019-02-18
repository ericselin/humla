import React from 'react';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';

const Head = styled.header`
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 4rem 1fr 4rem;
`;

const MenuBtn = styled.button`
  margin: 20px;
  color: white;
  padding: 0;
  background: none;
  border: none;
`;

const ViewBtn = styled.button`
  color: white;
  padding: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  position: relative;
  outline: none;
  cursor: pointer;
  text-transform: capitalize;
`;

const link = css`
  display: block;
  text-decoration: none;
  padding: 0.25rem;
  color: #000;
  font-size: 1rem;
`;

const Views = () => (
  <div
    css={css`
      position: absolute;
      top: 100%;
      padding: 0.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      left: -1px;
      text-align: left;
      background: white;
    `}
  >
    <Link to="/" css={link}>Main</Link>
    <Link to="/unprocessed" css={link}>Unprocessed</Link>
  </div>
);

const Header = ({ logout, location }) => {
  const [selector, setSelector] = React.useState(false);

  const toggle = () => {
    setSelector((prev) => {
      setSelector(!prev);
    });
  };

  const title = (location.pathname && location.pathname.substring(1)) || 'main';

  return (
    <Head>
      <MenuBtn onClick={logout}>
        <i className="material-icons">menu</i>
      </MenuBtn>
      <div>
        <ViewBtn onClick={toggle} type="button">
          {title}
          {selector && <Views />}
        </ViewBtn>
      </div>
    </Head>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  location: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default withRouter(Header);
