import React, { useEffect, useState } from 'react';
import { myTodos } from './firebase';
import Item from './Item';
import New from './New';

const List = () => {
  const [todos, setTodos] = useState({});

  useEffect(
    () => myTodos().onSnapshot((querySnapshot) => {
      const t = {};
      querySnapshot.forEach((doc) => {
        t[doc.id] = doc.data();
      });
      setTodos(t);
    }),
    [],
  );

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
