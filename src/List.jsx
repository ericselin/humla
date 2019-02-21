import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { list } from './firebase';
import Item from './Item';
import New from './New';

const views = {
  today: { where: ['soft', '>', '""'], orderBy: 'soft' },
  unprocessed: { where: ['soft', '==', ''] },
};

const List = ({ location }) => {
  const [todos, setTodos] = useState({});

  const view = location.pathname.substring(1);
  const { where, orderBy } = views[view];
  useEffect(list({ setTodos, where, orderBy }), []);

  return (
    <div>
      {Object.keys(todos).map(id => (
        <Item key={id} todo={todos[id]} id={id} />
      ))}
      <New />
    </div>
  );
};
List.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default List;
