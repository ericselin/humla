import { render } from './ha-list.js';

export default { title: 'List' };

export const regular = () => render([
  {
    context: '@work',
    completed: '',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@personal',
    completed: '',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@personal',
    completed: '',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@work',
    completed: '',
    title: 'For today',
    soft: '2019-10-01',
  },
  {
    context: '@work',
    completed: '',
    title: 'For today',
    soft: '2019-10-01',
  },
]);

export const weekView = () => render(
  [
    {
      context: '@work',
      completed: '',
      title: 'For today',
      soft: '2019-10-01',
    },
    {
      context: '@personal',
      completed: '',
      title: 'For today',
      soft: '2019-10-01',
    },
    {
      context: '@personal',
      completed: '',
      title: 'For today',
      soft: '2019-10-01',
    },
    {
      context: '@work',
      completed: '',
      title: 'For today',
      soft: '2019-10-01',
    },
    {
      context: '@work',
      completed: '',
      title: 'For today',
      soft: '2019-10-01',
    },
    {
      context: '@work',
      completed: '',
      title: 'Working during the weekend?',
      soft: '2019-10-04',
    },
    {
      context: '@personal',
      completed: '',
      title: 'Weekend task',
      soft: '2019-10-05',
    },
    {
      context: '@personal',
      completed: '',
      title: 'For today',
      soft: '2019-09-01',
    },
    {
      completed: '',
      title: 'For today',
      soft: '2019-10-03',
    },
  ],
  'week',
);

export const empty = () => render([]);
