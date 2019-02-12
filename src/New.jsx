import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import { db, uid } from './firebase';
import './Item.css';
import './New.css';

const New = () => {
  const [editor, setEditor] = useState(EditorState.createEmpty());
  let update = true;

  const onChange = (editorState) => {
    if (update) setEditor(editorState);
    else update = true;
    console.log(editorState.getCurrentContent().getBlockMap());
  };

  const onBlur = () => {
    const title = editor.getCurrentContent().getPlainText();
    if (title) {
      db.collection('todos').add({ title, owner: uid() });
      console.log('Created', title);
      setEditor(EditorState.createEmpty());
      update = false;
    }
  };

  return (
    <div className="item new">
      <i className="material-icons">add</i>
      <Editor placeholder="New..." editorState={editor} onChange={onChange} onBlur={onBlur} />
    </div>
  );
};

export default New;
