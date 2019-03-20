/* eslint-disable react/no-unescaped-entities */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
  useEffect, useState, Fragment, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { list } from './firebase';
import Item from './Item';
import { today, sunday } from './date';
import IconSmile from './icons/smile.svg';
import IconArrowUp from './icons/arrow-up.svg';
import IconArrowDown from './icons/arrow-down.svg';

const List = ({ location }) => {
  const views = {
    today: { where: [['soft', '<=', today()], ['soft', '>', '""']], orderBy: 'soft' },
    week: { where: [['soft', '<=', sunday()], ['soft', '>', '""']], orderBy: 'soft' },
    later: { where: [['soft', '>', sunday()], ['soft', '<', 'someday']], orderBy: 'soft' },
    someday: { where: [['soft', '>=', 'someday']], orderBy: 'soft' },
    all: { where: [], orderBy: 'soft' },
    unprocessed: { where: ['soft', '==', ''] },
  };

  const [todos, setTodos] = useState(undefined);
  const [selected, setSelected] = useState();
  const [closedContexts, setClosedContexts] = useState({});
  const selectedNode = useRef();

  // set document onclick to unselect when clicked outside selected
  useEffect(() => {
    const cb = (e) => {
      if (selectedNode.current && !selectedNode.current.contains(e.target)) {
        document.activeElement.blur();
        setSelected(null);
      }
    };
    document.addEventListener('click', cb);
    return () => {
      document.removeEventListener('click', cb);
    };
  });

  const [, view, tag] = location.pathname.split('/');
  const { where, orderBy } = views[view];
  if (tag) {
    where.push(['tags', 'array-contains', `#${tag}`]);
  }

  useEffect(list({ setTodos, where, orderBy }), [tag]);

  const todoArray = todos
    ? Object.keys(todos)
      .map((id) => {
        const { context, ...todo } = todos[id];
        return { id, context: context || '', ...todo };
      })
      .sort((a, b) => {
        if (a.context > b.context) return -1;
        if (a.context < b.context) return 1;
        return 0;
      })
    : undefined;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onKeyDown={(e) => {
        if ((e.key === 'Enter' && e.ctrlKey) || e.key === 'Escape') {
          setSelected(null);
        }
      }}
    >
      {todoArray
        && todoArray.map((todo, i, arr) => (
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
                  fill: white;
                  margin: 1.5rem 0 0.75rem;
                  display: grid;
                  grid-template-columns: 1fr min-content;
                  align-items: center;
                `}
              >
                <div>{todo.context || 'no context'}</div>
                <button
                  css={css`
                    padding: 0;
                    background: none;
                    border: none;
                    cursor: pointer;
                  `}
                  onClick={() => {
                    // eslint-disable-next-line max-len
                    setClosedContexts(c => Object.assign({}, c, { [todo.context]: !c[todo.context] }));
                  }}
                  type="button"
                >
                  {closedContexts[todo.context] ? <IconArrowDown /> : <IconArrowUp />}
                </button>
              </div>
            )}
            {!closedContexts[todo.context] && (
              <Item
                todo={todo}
                id={todo.id}
                selected={todo.id === selected}
                onSelected={() => {
                  setSelected(todo.id);
                }}
                ref={todo.id === selected ? selectedNode : undefined}
              />
            )}
          </Fragment>
        ))}
      {todoArray && !todoArray.length && (
        <div
          css={css`
            text-align: center;
            color: white;
            margin: 5rem;
            font-weight: 200;
          `}
        >
          <IconSmile
            css={css`
              fill: white;
              height: 5rem;
              width: auto;
            `}
          />
          <div>You're done - congratulations!</div>
        </div>
      )}
    </div>
  );
};
List.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default List;
