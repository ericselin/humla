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

  const toggleComplete = () => {
    const c = !todo.completed;
    update(id, { completed: c });
  };

  const dateChange = e => setSoft(e.target.value);

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
        grid-template-columns: min-content 1fr min-content;
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
        <i className="material-icons">{todo.completed ? 'check_box' : 'check_box_outline_blank'}</i>
      </button>
      <div>
        <input
          css={css`
            width: 100%;
            font-size: inherit;
            background: none;
            border: none;
            padding: 0.25rem;
          `}
          value={title}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
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
