import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import { db, uid } from './firebase';

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

  return <Editor editorState={editor} onChange={onChange} onBlur={onBlur} />;
};

export default New;
