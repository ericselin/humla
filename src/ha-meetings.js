import get, { getTime, authorize } from './lib/meetings.js';

/**
 * @param {Meeting} meeting
 * @returns {string}
 */
const renderMeeting = (meeting) => {
  const now = new Date();
  let modifier = '';
  if (meeting.end < now) modifier += ' past';
  if (meeting.start <= now && meeting.end >= now) modifier += ' current';
  if (meeting.free) modifier += ' free';
  return `
<div class="card card--meeting" ${modifier}>
  <div></div>
  <div>${meeting.title}</div>
  <div>
    <input value="${getTime(meeting.start)} - ${getTime(meeting.end)}" disabled />
  </div>
</div>
`;
};

const meetingsAuthHtml = `
<div>
  <div class="card">
    <div></div>
    <div>
      <p>
        Here, you can see your meetings for today. Just authorize and go!
      </p>
      <button id="authorize">Authorize</button>
    </div>
  </div>
  ${renderMeeting({
    title: 'Morning standup',
    start: new Date('1.1 9:00'),
    end: new Date('1.1 9:15'),
  })}
  ${renderMeeting({
    title: 'Lunch meeting with management',
    start: new Date('1.1 11:30'),
    end: new Date('1.1 13:00'),
  })}
</div>
`;

/**
 * @param {Meeting[]} meetings
 * @returns {string}
 */
const renderInner = (meetings) => {
  if (meetings) {
    if (meetings.length) {
      return `
      <ha-context>Meetings<button></button></ha-context>
      <div>
        ${meetings.map(renderMeeting).join('')}
      </div>`;
    }
    // if no meetings in array, render note
    return '<div class="empty">No meetings today</div>';
  }
  // if meetings was undefined, render the auth element
  return `
    <ha-context closed>Meetings<button></button></ha-context>
    <div>${meetingsAuthHtml}</div>`;
};

/**
 * @param {Meeting[]} meetings
 * @returns {string}
 */
export const render = (meetings) => `
<ha-meetings class="container week-view">
  ${renderInner(meetings)}
</ha-meetings>
`;

export default class HaMeetings extends HTMLElement {
  /**
   * @param {CustomEvent} evt
   */
  async navigation(evt) {
    const [, view] = evt.detail.path.split('/');
    if (view === 'today') this.innerHTML = renderInner(await get.today());
    else this.innerHTML = '';
  }

  async connectedCallback() {
    // immediately set inner html
    this.innerHTML = '<ha-context></ha-context>';
    window.addEventListener('navigate', this.navigation.bind(this));
    this.innerHTML = renderInner(await get.today());
    // if not authorized, we have a button
    const btn = this.querySelector('#authorize');
    if (btn) {
      btn.addEventListener('click', async () => {
        await authorize();
        this.innerHTML = renderInner(await get.today());
      });
    }
  }
}
HaMeetings.elementName = 'ha-meetings';

/** @typedef {import('./lib/meetings').Meeting} Meeting */
