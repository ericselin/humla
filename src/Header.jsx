import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
`;

const ViewsDiv = styled.div`
  position: absolute;
  top: 100%;
`;

const Views = () => (
  <ViewsDiv>
    <Link to="/">Main</Link>
    <Link to="/unprocessed">Unprocessed</Link>
  </ViewsDiv>
);

const Header = ({ logout }) => {
  const [selector, setSelector] = React.useState(false);

  const toggle = () => {
    setSelector((prev) => {
      setSelector(!prev);
    });
  };

  return (
    <Head>
      <MenuBtn onClick={logout}>
        <i className="material-icons">menu</i>
      </MenuBtn>
      <div>
        <ViewBtn onClick={toggle} type="button">
          Main
          {selector && <Views />}
        </ViewBtn>
      </div>
    </Head>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Header;
