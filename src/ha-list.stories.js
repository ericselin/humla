import { render } from './ha-list.js';

export default { title: 'List' };

const todos = [
  {
    context: '@work',
    completed: '',
    title: 'For today',
    soft: '2019-10-01',
    tags: ['#tag'],
  },
  {
    context: '@personal',
    completed: '',
    title: 'For today',
    soft: '2019-10-01',
    project: true,
    tags: ['#tag'],
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
    tags: ['#tag', '#another'],
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
];

export const regular = () => render(todos);

export const weekView = () => render(todos, 'week');

export const withMeetings = () => render(
  [
    {
      context: 'meetings',
      completed: '',
      title: 'This is a meeting',
      soft: '11:00',
      type: 'meeting',
    },
    ...todos,
  ],
  'today',
);

export const empty = () => render([]);
