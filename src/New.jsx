/* eslint-disable jsx-a11y/no-static-element-interactions */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
import { add } from './firebase';
import Overlay from './Overlay';
import Title from './Title';

const buttonCss = css`
  background: #6991c7;
  color: white;
  border: 1px solid #6991c7;
  padding: 0.5em 1em;
  border-radius: 0.125rem;
  cursor: pointer;
`;

const buttonSecondaryCss = [
  buttonCss,
  css`
    background: white;
    color: initial;
    margin-right: 1rem;
  `,
];

const buttonHintCss = css`
  margin-top: 0.125rem;
  font-size: 0.625rem;
  font-style: italic;
`;

const New = ({ visible, close }) => {
  const [title, setTitle] = useState('');
  const [forceUpdate, setForceUpdate] = useState(true);

  const onChange = t => setTitle(t);

  const addTask = (keepOpen) => {
    if (title) {
      add({ title, completed: '', soft: '' });
      if (keepOpen) setForceUpdate(f => !f);
      else close();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      addTask(e.shiftKey);
    }
  };

  return (
    visible && (
      <Overlay close={close}>
        <div
          onKeyDown={onKeyDown}
          css={css`
            padding: 1rem;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
            border-radius: 0.2rem;
            margin: auto;
            width: 30rem;
            max-width: calc(100% - 4rem);
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
            <Title title="" focus oneLine={false} onChange={onChange} key={forceUpdate} />
          </div>
          <div
            css={css`
              text-align: right;
            `}
          >
            <button
              type="button"
              css={buttonSecondaryCss}
              onClick={() => {
                addTask(true);
              }}
            >
              Create and add new
              <div css={buttonHintCss}>Ctrl+Shift+Enter</div>
            </button>
            <button
              type="button"
              css={buttonCss}
              onClick={() => {
                addTask(false);
              }}
            >
              Create
              <div css={buttonHintCss}>Ctrl+Enter</div>
            </button>
          </div>
        </div>
      </Overlay>
    )
  );
};

export default New;
