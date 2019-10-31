export const authorize = async () => {
  throw new Error('Not implemented');
};

const init = async () => {
  // re-sign-in with new scopes
  // load gapi with discovery docs
};

let initPromise;
const ensureInit = async () => {
  if (initPromise) return initPromise;
  initPromise = init();
  return initPromise;
};

const meetings = {
  /** @type {() => Promise<Meeting[]>} */
  today: async () => {
    await ensureInit();
    return undefined;
  },
};
export default meetings;

/**
 * @param {Date} date
 * @returns {string}
 */
export const getTime = (date) => (date
  ? `${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
  : '');

/**
 * @typedef Meeting
 * @property {string} title
 * @property {Date} [start]
 */
