/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useRef, useState } from 'react';

// eslint-disable-next-line react/prop-types
const Title = ({ title, update: updateFn, focus }) => {
  const [updated, forceUpdate] = useState(true);
  const div = useRef(null);

  const update = (keepOpen) => {
    updateFn(div.current.innerText, keepOpen);
    forceUpdate(prev => !prev);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      update(e.shiftKey);
    }
  };

  return (
    <div
      role="textbox"
      tabIndex="0"
      css={css`
        width: 100%;
        font-size: 1rem;
        line-height: 1.2;
        font-family: inherit;
        background: none;
        border: none;
        padding: 0.125rem;
        resize: none;
        overflow: hidden;
        white-space: pre-wrap;
        &:focus {
          outline: none;
        }
      `}
      contentEditable
      onBlur={update}
      onKeyDown={onKeyDown}
      ref={(ref) => {
        if (ref) {
          div.current = ref;
          if (focus) ref.focus();
        }
      }}
      key={focus ? updated : false}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  );
};

export default Title;
