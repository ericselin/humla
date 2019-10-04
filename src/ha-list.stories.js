import HaList from './ha-list.js';
import './ha-date.js';

export default { title: 'List' };

export const regular = () => {
  const list = new HaList();
  list.className = 'container week-list';
  list.render([
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
  return list;
};

export const weekView = () => {
  const list = new HaList();
  list.view = 'week';
  list.className = 'container week-list';
  list.render([
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
  ]);
  return list;
};

document.getElementById('root').appendChild(regular());
document.getElementById('root').appendChild(weekView());
