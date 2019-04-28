/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, {
  useState, useRef, useEffect, Fragment,
} from 'react';
import { update } from './firebase';
import Title from './Title';
import IconChecked from './icons/checked.svg';
import IconUnchecked from './icons/unchecked.svg';
import { today } from './date';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const icon = css`
  fill: rgba(0, 0, 0, 0.6);
`;

const Item = React.forwardRef(({
  todo, id, selected, onSelected,
}, ref) => {
  const [soft, setSoft] = useState(todo.soft);
  const [title, setTitle] = useState(todo.title);
  const datePicker = useRef(null);

  // update title when item is deselected
  const prevSelected = usePrevious(selected);
  if (prevSelected && !selected) {
    const { soft: newSoft } = update(id, { title });
    if (typeof newSoft !== 'undefined') setSoft(newSoft);
  }

  const updateSoft = () => {
    const { soft: s } = update(id, { soft, title });
    setSoft(s);
  };

  const toggleComplete = () => {
    const c = todo.completed ? '' : today();
    update(id, { completed: c });
  };

  const onFocus = (e) => {
    // if this fired because of complete button click, do not select
    if (e.target.type !== 'button') onSelected(e);
  };

  const dateChange = e => setSoft(e.target.value);
  const titleChange = t => setTitle(t);

  return (
    <div
      ref={ref}
      css={css`
        padding: 0.4rem;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        margin-bottom: 0.2rem;
        border-radius: 0.2rem;
        display: grid;
        gap: 0.5rem;
        grid-template-columns: min-content minmax(0, 1fr) fit-content(35%);
        grid-auto-flow: column;
        align-items: center;
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
      onFocus={todo.completed ? undefined : onFocus}
    >
      <button
        css={css`
          color: rgba(0, 0, 0, 0.6);
          margin: 0;
          padding: 0;
          background: none;
          border: none;
          cursor: pointer;
        `}
        type="button"
        onClick={toggleComplete}
      >
        {todo.completed ? <IconChecked css={icon} /> : <IconUnchecked css={icon} />}
      </button>
      {todo.completed ? (
        <div>{todo.title.split(/\n/)[0]}</div>
      ) : (
        <Fragment>
          <Title title={todo.title} oneLine={!selected} onChange={titleChange} />
          <div
            css={css`
              direction: rtl;
              margin: -0.125rem;
            `}
          >
            <input
              css={css`
                font-size: 0.75rem;
                border: 1px solid rgba(0, 0, 0, 0.3);
                border-radius: 0.125rem;
                padding: 0.25rem;
                width: 6em;
                text-align: center;
                background: none;
                font-family: inherit;
                margin: 0.125rem;
                direction: initial;
              `}
              onChange={dateChange}
              onBlur={updateSoft}
              onFocus={() => {
                datePicker.current.select();
              }}
              value={soft}
              placeholder="No date..."
              ref={datePicker}
              disabled={todo.completed}
            />
            <div
              css={css`
                display: inline-block;
              `}
            >
              {todo.tags
                && todo.tags.map(tag => (
                  <div
                    key={tag}
                    css={css`
                      display: inline-block;
                      font-size: 0.75rem;
                      border: 1px solid rgba(0, 0, 0, 0.3);
                      border-radius: 0.125rem;
                      padding: 0.25rem;
                      background: #798caf;
                      line-height: 1;
                      color: white;
                      margin: 0.125rem;
                      direction: initial;
                    `}
                  >
                    {tag}
                  </div>
                ))}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
});

export default Item;
