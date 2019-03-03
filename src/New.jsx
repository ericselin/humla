/* eslint-disable react/no-unescaped-entities */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { add } from './firebase';
import Overlay from './Overlay';
import Title from './Title';

const New = ({ visible, close }) => {
  const update = (title) => {
    if (title) {
      add({ title, completed: false, soft: '' });
      console.log('Created', title);
      close();
    }
  };

  return (
    visible && (
      <Overlay close={close}>
        <div
          css={css`
            padding: 0.4rem;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
            border-radius: 0.2rem;
            margin: auto;
          `}
        >
          <Title title="" update={update} />
          Press CTRL+ENTER to create. This task will go to your "Unprocessed" list.
        </div>
      </Overlay>
    )
  );
};

export default New;
