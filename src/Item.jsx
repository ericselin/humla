import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, ContentState } from 'draft-js';
import { db } from './firebase';

const Item = ({ todo, id }) => {
  const [editor, setEditor] = useState(
    EditorState.createWithContent(ContentState.createFromText(todo.title)),
  );

  const onChange = editorState => setEditor(editorState);

  const onBlur = () => {
    const title = editor.getCurrentContent().getPlainText();
    db.collection('todos')
      .doc(id)
      .update({ title });
    console.log('Updated', id, 'to', title);
  };

  return <Editor editorState={editor} onChange={onChange} onBlur={onBlur} />;
};

Item.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
};

export default Item;
