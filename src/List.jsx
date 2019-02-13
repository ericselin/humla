import React, { useEffect, useState } from 'react';
import { myTodos } from './firebase';
import Item from './Item';
import New from './New';

const List = () => {
  const [todos, setTodos] = useState({});

  useEffect(() => {
    console.log('Adding query snapshot listener...');
    return myTodos().orderBy('completed').onSnapshot((querySnapshot) => {
      console.log('Incoming query snapshot', querySnapshot);
      const t = {};
      querySnapshot.forEach((doc) => {
        t[doc.id] = doc.data();
      });
      setTodos(t);
    });
  }, []);

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
