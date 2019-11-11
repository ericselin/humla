import { getDate } from './date.js';

/**
 * @param {string} title
 * @returns {{ firstLine: string, nextAndFollowingStep: string, followingStep: string }}
 */
export const projectMatch = (title) => {
  const match = title.match(/^.+ \/ (.+\n([^ \n@].*))/);
  if (match) {
    return {
      firstLine: title.match(/(.*)\n/)[1],
      nextAndFollowingStep: match[1],
      followingStep: match[2],
    };
  }
  return undefined;
};

/**
 * @param {string} title
 * @returns {Todo}
 */
const processTitle = (title) => {
  const updates = { title };
  // check if we need to add tags
  const tags = /#\w+/g;
  Object.assign(updates, { tags: updates.title.match(tags) });

  // check for context
  const context = /(?:^|\s)(@\w+)/;
  const match = updates.title.match(context);
  Object.assign(updates, { context: match ? match[1] : null });

  // check for date
  const dateRegex = /\B!(\w+\.?\w*)\b/;
  const dateMatch = updates.title.match(dateRegex);
  if (dateMatch) {
    const [, dateStr] = dateMatch;
    const date = getDate(dateStr);
    updates.title = updates.title.replace(dateRegex, '');
    Object.assign(updates, { soft: date });
  }

  // check for project
  if (projectMatch(updates.title)) {
    Object.assign(updates, { project: true });
  } else {
    Object.assign(updates, { project: false });
  }

  // replace nbsp with space
  updates.title = updates.title.replace(/\u00a0/g, ' ');

  /** @type {Todo} */
  return /** @type {any} */ (updates);
};

export default processTitle;

/** @typedef {import('./types').Todo} Todo */
