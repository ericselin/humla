const CLIENT_ID = '804405641493-ilsat4d564fjc6aictgg6cagcsem94m9.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA8T1qoF1G2NQ4eN946MDlsEfZFyaoiPNU';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

let gapi;

export const authorize = async () => {
  await gapi.auth2.getAuthInstance().signIn();
};

const init = () => new Promise((resolve) => {
  // load gapi with discovery docs
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    // @ts-ignore
    gapi = window.gapi;
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      resolve();
    });
  };
  document.head.appendChild(script);
});

let initPromise;
const ensureInit = async () => {
  if (initPromise) return initPromise;
  initPromise = init();
  return initPromise;
};

const isAuthorized = () => {
  const auth = gapi.auth2.getAuthInstance();
  return auth.isSignedIn.get();
};

// get ISO string of the previous midnight
const midnightISO = (date) => `${date.toISOString().split('T')[0]}T00:00:00.000Z`;

const meetings = {
  /** @type {() => Promise<Meeting[]>} */
  today: async () => {
    // ensure everything is loaded
    await ensureInit();
    // bail if we're not authorized for calendar
    if (!isAuthorized()) return undefined;

    // get events
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: midnightISO(now),
      timeMax: midnightISO(tomorrow),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = response.result.items;
    const date = (timeObj) => {
      if (timeObj.dateTime) return new Date(timeObj.dateTime);
      const wholeDay = new Date(timeObj.date);
      wholeDay.setHours(0);
      return wholeDay;
    };
    const mapped = events.map((event) => {
      /** @type {Meeting} */
      const meeting = {
        start: date(event.start),
        end: date(event.end),
        title: event.summary,
        free: event.transparency === 'transparent',
      };
      return meeting;
    });
    return mapped;
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
 * @property {Date} start
 * @property {Date} end
 * @property {boolean} [free]
 */
