import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, ContentState } from 'draft-js';
import { myTodos } from './firebase';
import './Item.css';

const Item = ({ todo, id }) => {
  const [editor, setEditor] = useState(
    EditorState.createWithContent(ContentState.createFromText(todo.title)),
  );

  const onChange = editorState => setEditor(editorState);

  const onBlur = () => {
    const title = editor.getCurrentContent().getPlainText();
    myTodos()
      .doc(id)
      .update({ title });
    console.log('Updated', id, 'to', title);
  };

  const toggleComplete = () => {
    const c = !todo.completed;
    myTodos()
      .doc(id)
      .update({ completed: c });
    console.log('Updated', id, 'completion to', c);
    return c;
  };

  return (
    <div className={`item ${todo.completed ? 'completed' : ''}`}>
      <button className="checkbox" type="button" onClick={toggleComplete}>
        <i className="material-icons">{todo.completed ? 'check_box' : 'check_box_outline_blank'}</i>
      </button>
      <Editor editorState={editor} onChange={onChange} onBlur={onBlur} />
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
