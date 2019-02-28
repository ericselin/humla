/** @jsx jsx */
import { jsx } from '@emotion/core';
import { render } from 'react-dom';
import App from './App';

console.warn('Disabling console.clear');
console.clear = () => {
  console.warn('Not clearing console!');
};
console.log('Rendering root');

render(<App />, document.querySelector('#root'));
