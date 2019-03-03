/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

// eslint-disable-next-line react/prop-types
const Overlay = ({ children, close }) => {
  const closing = (e) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
      `}
      onClick={closing}
    >
      {children}
    </div>
  );
};

export default Overlay;
