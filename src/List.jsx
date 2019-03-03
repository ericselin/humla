/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { list } from './firebase';
import Item from './Item';
import { today, sunday } from './date';

const List = ({ location }) => {
  const views = {
    today: { where: [['soft', '<=', today], ['soft', '>', '""']], orderBy: 'soft' },
    week: { where: [['soft', '<=', sunday], ['soft', '>', '""']], orderBy: 'soft' },
    later: { where: [['soft', '>', sunday], ['soft', '<', 'someday']], orderBy: 'soft' },
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

  const todoArray = Object.keys(todos)
    .map((id) => {
      const { context, ...todo } = todos[id];
      return { id, context: context || '', ...todo };
    })
    .sort((a, b) => {
      if (a.context > b.context) return -1;
      if (a.context < b.context) return 1;
      return 0;
    });

  console.log(todoArray);

  return (
    <div>
      {todoArray.map((todo, i, arr) => (
        <Fragment key={todo.id}>
          {(i === 0 || todo.context !== arr[i - 1].context) && (
            <div
              css={css`
                font-family: Roboto;
                font-style: normal;
                font-weight: 200;
                line-height: normal;
                font-size: 16px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: white;
                margin: 1.5rem 0 0.75rem;
              `}
            >
              {todo.context || 'no context'}
            </div>
          )}
          <Item todo={todo} id={todo.id} />
        </Fragment>
      ))}
    </div>
  );
};
List.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default List;
