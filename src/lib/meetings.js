export const init = async () => true;

export const authorize = async () => {
  throw new Error('Not implemented');
};

const meetings = {
  today: async () => {
    /** @type {Todo[]} */
    const todos = [
      {
        completed: '',
        soft: '9:00',
        title: 'This is a dummy meeting',
        context: 'Meetings',
        type: 'meeting',
      },
    ];
    return todos;
  },
};

export default meetings;

/** @typedef {import('./types').Todo} Todo */
