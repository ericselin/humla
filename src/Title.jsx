/* eslint-disable react/prop-types */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useRef } from 'react';

/**
 * @typedef TitleProps
 * @property {string} title
 * @property {(title: string) => void} onChange
 * @property {boolean?} [oneLine]
 * @property {boolean?} [focus]
 */

/**
 * @type {import('react').FC<TitleProps>}
 */
const Title = ({
  title, onChange, oneLine, focus,
}) => {
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const div = useRef(null);

  const onKeyUp = () => {
    // safety: only update if not one-liner
    if (!oneLine) {
      const newTitle = Array.from(div.current.childNodes).map(el => el.textContent.trim()).join('\n');
      onChange(newTitle);
    }
  };

  // always blur if this is a one-liner
  if (oneLine && div.current) {
    div.current.blur();
  }

  const titleDiv = title.replace(/^(.*)$/gm, '<div>$1</div>');

  return (
    <div
      role="textbox"
      tabIndex={0}
      css={css`
        width: 100%;
        font-size: 1rem;
        line-height: 1.2;
        font-family: inherit;
        background: none;
        border: none;
        resize: none;
        overflow: hidden;
        & > div {
          min-height: 1.2em;
        }
        &:empty::before {
          content: 'New task...';
          color: rgba(0, 0, 0, 0.3);
        }
        &:focus {
          outline: none;
        }
        ${oneLine
          && css`
            & > div:not(:first-of-type) {
              display: none;
            }
          `}
      `}
      contentEditable
      onKeyUp={onKeyUp}
      ref={(ref) => {
        if (ref) {
          div.current = ref;
          if (focus) ref.focus();
        } else {
          div.current = null;
        }
      }}
      dangerouslySetInnerHTML={{ __html: titleDiv }}
    />
  );
};

export default Title;
