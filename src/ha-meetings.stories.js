import { render } from './ha-meetings.js';

export default { title: 'Meetings' };

export const NotAuthorized = () => render(undefined);

export const NotAuthorizedOpen = () => render(undefined).replace('ha-context closed', 'ha-context');

export const Default = () => render([
  {
    title: 'This is a dummy meeting',
    start: new Date(),
  },
  {
    title: 'Do some stuff',
  },
]);
