import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { list } from './firebase';
import Item from './Item';
import New from './New';

const date = d => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

const today = new Date();
const sunday = new Date();
sunday.setDate(sunday.getDate() + (7 - sunday.getDay()));

const List = ({ location }) => {
  console.log(today, date(today));
  const views = {
    today: { where: [['soft', '<=', date(today)], ['soft', '>', '""']], orderBy: 'soft' },
    week: { where: [['soft', '<=', date(sunday)], ['soft', '>', '""']], orderBy: 'soft' },
    later: { where: [['soft', '>', date(sunday)], ['soft', '<', 'someday']], orderBy: 'soft' },
    someday: { where: [['soft', '>=', 'someday']], orderBy: 'soft' },
    all: { where: [], orderBy: 'soft' },
    unprocessed: { where: ['soft', '==', ''] },
  };

  const [todos, setTodos] = useState({});

  const [, view, tag] = location.pathname.split('/');
  const { where, orderBy } = views[view];
  if (tag) {
    where.push(['tags', 'array-contains', `#${tag}`]);
  }

  useEffect(list({ setTodos, where, orderBy }), [tag]);

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
