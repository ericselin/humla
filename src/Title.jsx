/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useRef } from 'react';
import PropTypes from 'prop-types';

const Title = ({
  title, onChange, oneLine, focus,
}) => {
  const div = useRef(null);

  const onKeyUp = () => {
    // safety: only update if not one-liner
    if (!oneLine) onChange(div.current.innerText);
  };

  // always blur if this is a one-liner
  if (oneLine && div.current) {
    div.current.blur();
  }

  const titleDiv = title ? title.replace(/^(.*)$/gm, '<div>$1</div>') : '';

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

Title.propTypes = {
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  oneLine: PropTypes.bool,
  focus: PropTypes.bool,
};

Title.defaultProps = {
  oneLine: undefined,
  focus: undefined,
};

export default Title;
