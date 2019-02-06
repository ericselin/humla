import React, { useEffect, useState } from 'react';
import { myTodos } from './firebase';

const List = () => {
  const [todos, setTodos] = useState([]);

  useEffect(
    () => myTodos().onSnapshot((querySnapshot) => {
      const t = [];
      querySnapshot.forEach((doc) => {
        t.push(doc.data());
      });
      setTodos(t);
    }),
    [],
  );

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.title}>{todo.title}</li>
      ))}
    </ul>
  );
};
export default List;
