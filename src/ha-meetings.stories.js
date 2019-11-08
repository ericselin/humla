import { render } from './ha-meetings.js';

export default { title: 'Meetings' };

export const NotAuthorized = () => render(undefined);

export const NotAuthorizedOpen = () => render(undefined).replace('ha-context closed', 'ha-context');

export const Default = () => render([
  {
    title: 'This meeting is no longer',
    start: new Date(2019, 1, 1),
    end: new Date(2019, 1, 1),
  },
  {
    title: 'Do some stuff',
    start: new Date(2019, 1, 1),
    end: new Date(2060, 1, 1),
  },
  {
    title: 'future things',
    start: new Date(2060, 1, 1),
    end: new Date(2060, 1, 1),
  },
  {
    title: 'Free time, but in calendar',
    start: new Date(2060, 1, 1),
    end: new Date(2060, 1, 1),
    free: true,
  },
]);
