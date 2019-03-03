/* eslint-disable react/no-unescaped-entities */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { add } from './firebase';
import Overlay from './Overlay';
import Title from './Title';

const New = ({ visible, close }) => {
  const update = (title, keepOpen) => {
    if (title) {
      add({ title, completed: false, soft: '' });
      console.log('Created', title);
      if (keepOpen) return true;
      close();
    }
    return undefined;
  };

  return (
    visible && (
      <Overlay close={close}>
        <div
          css={css`
            padding: 1rem;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
            border-radius: 0.2rem;
            margin: auto;
            max-width: 35rem;
          `}
        >
          <div
            css={css`
              font-size: 1.25rem;
              font-weight: 200;
              text-align: center;
            `}
          >
            New task
          </div>
          <div
            css={css`
              margin: 1rem 0;
            `}
          >
            <Title
              title=""
              update={update}
              focus
            />
          </div>
          <div
            css={css`
              font-size: 0.75rem;
              color: rgba(0, 0, 0, 0.8);
            `}
          >
            Press Ctrl+Enter to create (Ctrl+Shift+Enter to immediately add another task). This task
            will go to your "Unprocessed" list.
          </div>
        </div>
      </Overlay>
    )
  );
};

export default New;
