/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const Title = ({ title: initialTitle, update: updateFn, focus }) => {
  const [title, setTitle] = useState(initialTitle);

  // re-set title when the title prop changes
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const onChange = e => setTitle(e.target.value);

  const onBlur = () => {
    updateFn(title);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      console.log('Firing update function');
      if (updateFn(title, e.shiftKey)) setTitle('');
    }
    if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      console.log('TODO: Line should be moved here...');
    }
  };

  const lines = (title.match(/\n/g) || []).length + 1;

  return (
    <textarea
      css={css`
        width: 100%;
        font-size: 1rem;
        line-height: 1.2;
        font-family: inherit;
        background: none;
        border: none;
        padding: 0.125rem;
        height: 1.2rem;
        resize: none;
        overflow: hidden;
        &:focus {
          height: ${lines * 1.2}rem;
        }
      `}
      placeholder="New task..."
      value={title}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      ref={(ref) => {
        if (ref && focus) ref.focus();
      }}
    />
  );
};

export default Title;
