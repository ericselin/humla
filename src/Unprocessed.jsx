import React, { useEffect, useState } from 'react';
import { unprocessed } from './firebase';
import Item from './Item';
import New from './New';

const List = () => {
  const [todos, setTodos] = useState({});

  // possibly make this a custom hook
  useEffect(unprocessed(setTodos), []);

  return (
    <div>
      {Object.keys(todos).map(id => (
        <Item key={id} todo={todos[id]} id={id} />
      ))}
      <New />
    </div>
  );
};
export default List;
