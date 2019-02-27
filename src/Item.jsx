/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { update } from './firebase';

const Item = ({ todo, id }) => {
  const [title, setTitle] = useState(todo.title);
  const [soft, setSoft] = useState(todo.soft);

  const onChange = e => setTitle(e.target.value);

  const onBlur = () => {
    update(id, { title, soft });
  };

  const onKeyDown = (e) => {
    if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      console.log('TODO: Line should be moved here...');
    }
  };

  const toggleComplete = () => {
    const c = !todo.completed;
    update(id, { completed: c });
  };

  const dateChange = e => setSoft(e.target.value);

  const lines = (title.match(/\n/g) || []).length + 1;

  return (
    <div
      css={css`
        padding: 0.4rem;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        margin-bottom: 0.2rem;
        border-radius: 0.2rem;
        display: grid;
        gap: 0.4rem;
        grid-template-columns: min-content 1fr;
        grid-auto-flow: column;
        align-items: center;
        ${todo.completed
        ? css`
              background: none;
              box-shadow: none;
              text-decoration: line-through;
            `
        : undefined}
      `}
    >
      <button
        css={css`
          color: rgba(0, 0, 0, 0.6);
          margin: 0;
          padding: 0;
          background: none;
          border: none;
        `}
        type="button"
        onClick={toggleComplete}
      >
        <i
          css={css`
            display: block;
          `}
          className="material-icons"
        >
          {todo.completed ? 'check_box' : 'check_box_outline_blank'}
        </i>
      </button>
      <textarea
        css={css`
          width: 100%;
          font-size: 1rem;
          line-height: 1.2;
          font-family: inherit;
          background: none;
          border: none;
          padding: 0.1875rem;
          height: 1.2rem;
          resize: none;
          overflow: hidden;
          &:focus {
            height: ${lines * 1.2}rem;
          }
        `}
        value={title}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      {todo.tags
        && todo.tags.map(tag => (
          <div
            key={tag}
            css={css`
              font-size: 0.75rem;
              border: 1px solid rgba(0, 0, 0, 0.3);
              border-radius: 0.125rem;
              padding: 0.25rem;
              background: #798caf;
              line-height: 1;
              color: white;
            `}
          >
            {tag}
          </div>
        ))}
      <input
        css={css`
          font-size: 0.75rem;
          border: 1px solid rgba(0, 0, 0, 0.3);
          border-radius: 0.125rem;
          padding: 0.25rem;
          width: 6em;
          text-align: center;
          background: none;
        `}
        onChange={dateChange}
        onBlur={onBlur}
        value={soft}
        placeholder="No date..."
      />
    </div>
  );
};

Item.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
};

export default Item;
