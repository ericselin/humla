/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, ContentState } from 'draft-js';
import { update } from './firebase';

const Item = ({ todo, id }) => {
  const [editor, setEditor] = useState(
    EditorState.createWithContent(ContentState.createFromText(todo.title)),
  );

  const onChange = editorState => setEditor(editorState);

  const onBlur = () => {
    const title = editor.getCurrentContent().getPlainText();
    update(id, { title });
    console.log('Updated', id, 'to', title);
  };

  const toggleComplete = () => {
    const c = !todo.completed;
    update(id, { completed: c });
    console.log('Updated', id, 'completion to', c);
    return c;
  };

  const dateChange = (e) => {
    update(id, { [e.target.name]: e.target.value });
  };

  return (
    <div
      css={css`
        padding: 0.4rem;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        margin-bottom: 0.2rem;
        border-radius: 0.2rem;
        display: grid;
        gap: 0.4rem;
        grid-template-columns: min-content repeat(3, 1fr);
        ${todo.completed
        ? css`
              background: none;
              box-shadow: none;
              text-decoration: line-through;
            `
        : undefined}
      `}
    >
      <button
        css={css`
          grid-row: 1 / 3;
          align-self: start;
          color: rgba(0, 0, 0, 0.6);
          margin: 0;
          padding: 0;
          background: none;
          border: none;
        `}
        type="button"
        onClick={toggleComplete}
      >
        <i className="material-icons">{todo.completed ? 'check_box' : 'check_box_outline_blank'}</i>
      </button>
      <div
        css={css`
          grid-column: 2 / -1;
        `}
      >
        <Editor editorState={editor} onChange={onChange} onBlur={onBlur} />
      </div>
      <label htmlFor="soft">
        Soft date:
        <input type="date" name="soft" id="soft" onChange={dateChange} defaultValue={todo.soft} />
      </label>
      <label htmlFor="hard">
        Hard date:
        <input type="date" name="hard" id="hard" onChange={dateChange} defaultValue={todo.hard} />
      </label>
      <label htmlFor="due">
        Due date:
        <input type="date" name="due" id="due" onChange={dateChange} defaultValue={todo.due} />
      </label>
    </div>
  );
};

Item.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
};

export default Item;
