/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
import { add } from './firebase';

const New = () => {
  const [title, setTitle] = useState('');

  const onChange = (e) => {
    setTitle(e.target.value);
  };

  const update = () => {
    if (title) {
      add({ title, completed: false, soft: '' });
      console.log('Created', title);
      setTitle('');
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter') update();
  };

  return (
    <div
      css={css`
        padding: 0.4rem;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        margin-bottom: 0.2rem;
        border-radius: 0.2rem;
        display: grid;
        gap: 0.4rem;
        grid-template-columns: min-content 1fr;
      `}
    >
      <i
        css={css`
          color: rgb(0, 0, 0, 0.5);
        `}
        className="material-icons"
      >
        add
      </i>
      <input
        css={css`
          background: none;
          font-family: inherit;
          font-size: inherit;
          border: none;
        `}
        type="text"
        value={title}
        onChange={onChange}
        onBlur={update}
        onKeyPress={onKey}
        placeholder="New task..."
      />
    </div>
  );
};

export default New;
