import { today, sunday, thisMonday } from './date.js';
import processTitle, { projectMatch } from './keywords.js';
import auth from './auth.js';

/** @typedef {import('@firebase/app-types').FirebaseNamespace} FirebaseNamespace */
/** @typedef {import('@firebase/auth')} FirebaseAuth */
/** @typedef {import('@firebase/firestore')} FirebaseFirestore */
/** @typedef {import('@firebase/remote-config')} FirebaseRemoteConfig */

/** @type {FirebaseNamespace} */
// @ts-ignore
// eslint-disable-next-line prefer-destructuring
const firebase = window.firebase;
const remoteConfig = firebase && firebase.remoteConfig();

/**
 * Get remote config flag
 * (Always returns true if remote config not available.)
 *
 * @param {string} name Remote config name
 * @returns {boolean}
 */
export const getConfig = (name) => (remoteConfig ? remoteConfig.getBoolean(name) : true);

/**
 * @param {Todo} a
 * @param {Todo} b
 * @returns {number}
 */
export const todoSorter = (a, b) => {
  if ((a.context || '') > (b.context || '')) return -1;
  if ((a.context || '') < (b.context || '')) return 1;
  if ((a.soft || '') < (b.soft || '')) return -1;
  if ((a.soft || '') > (b.soft || '')) return 1;
  if (a.sortstamp && b.sortstamp) {
    if (a.sortstamp.valueOf() < b.sortstamp.valueOf()) return -1;
    if (a.sortstamp.valueOf() > b.sortstamp.valueOf()) return 1;
  }
  return 0;
};

/**
 * @param {{[id: string]: Todo[]}} obj
 * @param {Todo} t
 * @returns {{[id: string]: Todo[]}}
 */
export const contextReducer = (obj, t) => {
  /* eslint-disable no-param-reassign */
  const context = t.context || 'no context';
  if (obj[context]) {
    obj[context].push(t);
  } else {
    obj[context] = [t];
  }
  return obj;
  /* eslint-enable */
};

const weekDays = ['Weekend', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Weekend'];
export const week = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Weekend: [],
};

/**
 * @param {{[weekDay: string]: Todo[]}} weekObj
 * @param {Todo} t
 * @returns {{[weekDay: string]: Todo[]}}
 */
export const weekReducer = (weekObj, t) => {
  let day = weekDays[new Date(t.soft).getDay()];
  // see if this is overdue for this week
  if (thisMonday() > t.soft) [, day] = weekDays;
  return { ...weekObj, [day]: weekObj[day].concat(t) };
};

/**
 * @param {Todo[][]} weekArr
 * @param {Todo} t
 * @returns {Todo[][]}
 */
export const completedThisWeek = (weekArr, t) => {
  const dayNum = new Date(t.completed).getDay() || 7;
  let dayIndex = dayNum - 1;
  if (dayIndex === 6) dayIndex = 5;
  // eslint-disable-next-line no-param-reassign
  if (!weekArr[dayIndex]) weekArr[dayIndex] = [];
  weekArr[dayIndex].push(t);
  return weekArr;
};

/**
 * @param {import('@firebase/firestore-types').QueryDocumentSnapshot} doc
 * @returns {Todo}
 */
// @ts-ignore
const idMapper = (doc) => ({ id: doc.id, /** @type {Todo} */ ...(doc.data()) });

export const todos = () => {
  /** @type {import('@firebase/firestore-types').Query} */
  let query = firebase.firestore().collection('todos');

  const chainable = {
    uncompleted() {
      query = query.where('completed', '==', '');
      return this;
    },

    today() {
      query = query.where('soft', '<=', today()).where('soft', '>', '""');
      return this;
    },

    week() {
      query = query.where('soft', '<=', sunday()).where('soft', '>', '""');
      return this;
    },

    later() {
      query = query.where('soft', '>', sunday()).where('soft', '<', 'someday');
      return this;
    },

    someday() {
      query = query.where('soft', '>=', 'someday');
      return this;
    },

    unprocessed() {
      query = query.where('soft', '==', '');
      return this;
    },

    search(search) {
      if (search.startsWith('@')) query = query.where('context', '==', search);
      else if (search.startsWith('#')) query = query.where('tags', 'array-contains', search);
      else throw new Error('Not implemented');
      return this;
    },

    completed: {
      today() {
        query = query.where('completed', '==', today());
        return chainable;
      },
      week() {
        query = query.where('completed', '>=', thisMonday()).where('completed', '<=', sunday());
        return chainable;
      },
    },

    /**
     * @param {(todos: Todo[]) => any} listener Change listener
     * @returns {Promise<() => any>} Unsubscribe function
     */
    async listen(listener) {
      await auth();
      const { uid } = firebase.auth().currentUser;
      query = query.where('owner', '==', uid);
      return query.onSnapshot((snapshot) => {
        const data = snapshot.docs.map(idMapper);
        listener(data.sort(todoSorter));
      });
    },
  };

  return chainable;
};

/**
 * @param {Todo} todo
 */
export const add = (todo) => {
  /** @type {Todo & {owner: string}} */
  const addable = {
    ...todo,
    ...processTitle(todo.title),
    owner: firebase.auth().currentUser.uid,
  };
  firebase
    .firestore()
    .collection('todos')
    .add(addable);
  // @ts-ignore
  if (firebase) firebase.analytics().logEvent('todo created');
};

/**
 * @param {Todo} todo Fully processed todo
 * @param {boolean} [projects]
 * @returns {{ update: Todo, add?: Todo }} Completed project subtask to add
 */
export const getUpdates = (todo, projects = true) => {
  const updates = {
    update: { ...todo, ...processTitle(todo.title) },
  };

  if (projects) {
    const match = projectMatch(updates.update.title);
    if (todo.completed && match) {
      updates.add = {
        ...updates.update,
        title: match.firstLine,
      };
      updates.update.title = updates.update.title.replace(
        match.nextAndFollowingStep,
        match.followingStep,
      );
      updates.update.completed = '';
    }
  }

  if (todo.completed) {
    // @ts-ignore
    if (firebase) firebase.analytics().logEvent('todo completed');
  }

  return updates;
};

export const doc = (id) => {
  const me = firebase
    .firestore()
    .collection('todos')
    .doc(id);
  return {
    /**
     * @param {Todo} updates
     * @returns {Todo}
     */
    update(updates) {
      const { update: updateTodo, add: addTodo } = getUpdates(updates);
      if (updateTodo) me.update(updateTodo);
      if (addTodo) add(addTodo);
      return updateTodo;
    },
    async get() {
      const snapshot = await me.get();
      return /** @type {Todo} */(snapshot.data());
    },
  };
};

/**
 * Move todo with `moveId` between the other two todos
 *
 * @param {string} moveId
 * @param {string} afterId
 * @param {string} beforeId
 * @param {object} [deps]
 * @param {(id: string) => Promise<Todo>} [deps.get]
 * @param {(id: string, updates: Todo) => Promise<any>} [deps.update]
 * @param {(millis: number) => any} [deps.timestamp]
 */
export const move = async (moveId, afterId, beforeId, deps = {
  get: async (id) => id && doc(id).get(),
  update: async (id, updates) => doc(id).update(updates),
  timestamp: firebase.firestore.Timestamp.fromMillis,
}) => {
  if (!moveId || (!beforeId && !afterId)) throw new Error('Movable id and at least before or after id required');
  const [moveTodo, before, after] = await Promise.all([
    deps.get(moveId),
    deps.get(beforeId),
    deps.get(afterId),
  ]);
  let newMillis;
  const beforeMillis = before && before.sortstamp && before.sortstamp.toMillis();
  const afterMillis = after && after.sortstamp && after.sortstamp.toMillis();
  if (beforeMillis && afterMillis) newMillis = (beforeMillis + afterMillis) / 2;
  else if (beforeMillis) newMillis = beforeMillis - 60000;
  else if (afterMillis) newMillis = afterMillis + 60000;
  const updates = {
    sortstamp: deps.timestamp(newMillis),
  };
  const soft = (after && after.soft) || (before && before.soft);
  if (soft !== moveTodo.soft) updates.soft = soft;
  const context = (after && after.context) || (before && before.context);
  if (context !== moveTodo.context) {
    updates.context = context;
    updates.title = moveTodo.title.replace(moveTodo.context, context);
  }
  // @ts-ignore
  await deps.update(moveId, updates);
};

export default firebase;

/** @typedef {import('./types').Todo} Todo */

/**
 * @typedef Context
 * @property {string} context
 * @property {Todo[]} todos
 */
