import { render } from './ha-todo.js';
import './ha-title.js';

export default { title: 'Todo' };

export const basic = () => render({
  context: '@work',
  completed: '',
  title: 'For today',
  soft: '2019-10-01',
});

export const completed = () => render({
  context: '@work',
  completed: '2019-10-10',
  title: 'Completed',
  soft: '2019-10-01',
});

export const withTags = () => render({
  context: '@work',
  completed: '',
  title: 'This todo has tags',
  soft: '2019-10-01',
  tags: ['#dev', '#difficult'],
});

export const meeting = () => render({
  context: 'meetings',
  completed: '',
  title: 'This is a meeting',
  soft: '11:00',
  type: 'meeting',
});
