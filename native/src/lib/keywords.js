import { getDate } from './date.js';

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
  const context = /@\w+/;
  const match = updates.title.match(context);
  Object.assign(updates, { context: match ? match[0] : null });

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
  const projectMatch = updates.title.match(/^.+ \/ .+\n[^ \n@]+/);
  if (projectMatch) {
    Object.assign(updates, { project: true });
  } else {
    Object.assign(updates, { project: false });
  }

  /** @type {Todo} */
  return /** @type {any} */ (updates);
};

export default processTitle;

/** @typedef {import('./types').Todo} Todo */
