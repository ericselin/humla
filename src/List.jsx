import React, { useEffect, useState } from 'react';
import { myTodos } from './firebase';

const List = () => {
  const [todos, setTodos] = useState([]);

  const get = async () => {
    const querySnapshot = await myTodos().get();
    const t = [];
    querySnapshot.forEach((doc) => {
      t.push(doc.data());
    });
    setTodos(t);
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.title}>{todo.title}</li>
      ))}
    </ul>
  );
};
export default List;
