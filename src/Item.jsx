/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { update } from './firebase';
import Title from './Title';

const Item = ({
  todo, id, selected, onSelected,
}) => {
  const [soft, setSoft] = useState(todo.soft);
  const datePicker = useRef(null);

  const updateSoft = () => {
    const { soft: s } = update(id, { soft });
    setSoft(s);
  };

  const updateTitle = (title) => {
    const { soft: newSoft } = update(id, { title });
    if (typeof newSoft !== 'undefined') setSoft(newSoft);
  };

  const toggleComplete = () => {
    const c = !todo.completed;
    update(id, { completed: c });
  };

  const dateChange = e => setSoft(e.target.value);

  const title = `${todo.title.replace('\n', '\n<span class="rest">')}</span>`;

  return (
    <div
      id={id}
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
        align-items: flex-start;
        border-left: 0.2rem solid transparent;
        ${selected
        ? css`
              border-color: #132640;
            `
        : css`
              & .rest {
                display: none;
              }
            `}
        ${todo.completed
          ? css`
              background: none;
              box-shadow: none;
              text-decoration: line-through;
            `
          : undefined}
      `}
      onFocus={onSelected}
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
      <Title title={title} update={updateTitle} />
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
        onBlur={updateSoft}
        onFocus={() => {
          datePicker.current.select();
        }}
        value={soft}
        placeholder="No date..."
        ref={datePicker}
      />
    </div>
  );
};

Item.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelected: PropTypes.func.isRequired,
};

export default Item;
