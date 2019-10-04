import { render } from './ha-completed.js';
import './ha-date.js';

export default { title: 'List' };

export const regular = () => render([
  {
    context: '@work',
    completed: 'y',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@personal',
    completed: 'y',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@personal',
    completed: 'y',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@work',
    completed: 'y',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@work',
    completed: 'y',
    title: 'For today',
    soft: '2019-10-01',
  },
]);

export const weekView = () => render(
  [
    {
      context: '@work',
      completed: '2019-10-01',
      title: 'Tuesday',
      soft: '2019-10-01',
    },
    {
      context: '@personal',
      completed: '2019-10-01',
      title: 'Completed Tuesday',
      soft: '2019-10-01',
    },
    {
      context: '@personal',
      completed: '2019-10-02',
      title: 'Completed Wed',
      soft: '2019-10-01',
    },
    {
      context: '@work',
      completed: '2019-10-02',
      title: 'Wednesday',
      soft: '2019-10-01',
    },
    {
      context: '@work',
      completed: '2019-10-04',
      title: 'Completed Friday',
      soft: '2019-10-01',
    },
  ],
  'week',
);

document.getElementById('root').innerHTML = [regular(), weekView()].join('');
