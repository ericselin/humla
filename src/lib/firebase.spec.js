import {
  todoSorter,
  contextReducer,
  getUpdates,
  weekReducer,
  week,
  completedThisWeek,
  move,
} from './firebase.js';
import { set, reset } from './mockdate.js';

describe('todo sorter', () => {
  it('sorts dates correctly', () => {
    const s1 = { soft: '2019-05-01' };
    const s2 = { soft: '2019-05-02' };
    const s4 = { soft: '2019-05-04' };
    const arr = [s2, s4, s1];
    arr.sort(todoSorter);
    expect(arr).toEqual([s1, s2, s4]);
  });

  it('sorts context correctly', () => {
    const ca1 = { context: '@a' };
    const ca2 = { context: '@a' };
    const cb = { context: '@b' };
    const arr = [ca1, cb, ca2];
    // @ts-ignore
    arr.sort(todoSorter);
    expect(arr).toEqual([cb, ca1, ca2]);
  });

  it('sorts context correctly when context null', () => {
    const cn = { context: null };
    const ca = { context: '@a' };
    const cb = { context: '@b' };
    const arr = [cn, ca, cb, cn];
    // @ts-ignore
    arr.sort(todoSorter);
    expect(arr).toEqual([cb, ca, cn, cn]);
  });

  it('sorts combination correctly', () => {
    const cas1 = { soft: '2019-05-01', context: '@a' };
    const cbs2 = { soft: '2019-05-02', context: '@b' };
    const cas4 = { soft: '2019-05-04', context: '@a' };
    const arr = [cas1, cas4, cbs2];
    // @ts-ignore
    arr.sort(todoSorter);
    expect(arr).toEqual([cbs2, cas1, cas4]);
  });
});

describe('context reducer', () => {
  it('groups by context', async () => {
    const arr = [
      { context: '@a', title: 'hello 1' },
      { context: '@b', title: 'hello b' },
      { context: '@a', title: 'hello 2' },
    ];
    // @ts-ignore
    const categories = arr.reduce(contextReducer, {});
    expect(categories).toEqual({
      // @ts-ignore
      '@a': [arr[0], arr[2]],
      '@b': [arr[1]],
    });
  });
});

describe('weekday reducer', () => {
  it('groups by weekday', async () => {
    set('2019-08-28');
    const arr = [
      { soft: '2019-08-26', title: 'mon 1' },
      { soft: '2019-08-26', title: 'mon 2' },
      { soft: '2019-08-27', title: 'tue' },
      { soft: '2019-08-26', title: 'mon 3' },
      { soft: '2019-09-01', title: 'sun' },
      { soft: '2019-08-31', title: 'sat' },
    ];
    // @ts-ignore
    const categories = arr.reduce(weekReducer, week);
    // @ts-ignore
    expect(categories).toEqual({
      // @ts-ignore
      Monday: [arr[0], arr[1], arr[3]],
      // @ts-ignore
      Tuesday: [arr[2]],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      // @ts-ignore
      Weekend: [arr[4], arr[5]],
    });
    // assert week wasn't mutated
    expect(week).toEqual({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Weekend: [],
    });
  });

  it('sets overdue to monday', async () => {
    const arr = [{ soft: '2019-09-01', title: 'sunday' }];
    // @ts-ignore
    const categories = arr.reduce(weekReducer, week); // ?
    // @ts-ignore
    expect(categories.Monday.length).toEqual(1);
  });

  afterEach(() => {
    reset();
  });
});

describe('completed this week reducer', () => {
  it('groups by weekday', async () => {
    set('2019-08-28');
    const arr = [
      { completed: '2019-08-26', title: 'mon 1' },
      { completed: '2019-08-26', title: 'mon 2' },
      { completed: '2019-08-27', title: 'tue' },
      { completed: '2019-08-26', title: 'mon 3' },
      { completed: '2019-09-01', title: 'sun' },
      { completed: '2019-08-31', title: 'sat' },
    ];
    // @ts-ignore
    const categories = arr.reduce(completedThisWeek, []);
    // @ts-ignore
    expect(categories).toEqual([
      // @ts-ignore
      [arr[0], arr[1], arr[3]],
      // @ts-ignore
      [arr[2]],
      undefined,
      undefined,
      undefined,
      // @ts-ignore
      [arr[4], arr[5]],
    ]);
  });

  afterEach(() => {
    reset();
  });
});

describe('project subtask', () => {
  const regular = {
    completed: '2019-06-17',
    title: 'this is a regular task',
    soft: '2019-06-17',
  };

  it('returns falsey for add on not project', () => {
    const { add } = getUpdates(regular, true);
    expect(add).toBeFalsy();
  });

  it('returns falsey for add on not project', () => {
    const { update } = getUpdates(regular, true);
    expect(update).toEqual({
      completed: '2019-06-17',
      title: 'this is a regular task',
      soft: '2019-06-17',
      project: false,
      context: null,
      tags: null,
    });
  });

  const project = {
    completed: '2019-06-17',
    project: true,
    title: 'this / is done\nnext task',
    soft: '2019-06-17',
  };

  it('returns completed subtask if completing', () => {
    const { add } = getUpdates(project, true);
    expect(add).toEqual({
      completed: '2019-06-17',
      project: true,
      title: 'this / is done',
      soft: '2019-06-17',
      context: null,
      tags: null,
    });
  });

  it('does not make add when not completed', () => {
    const todo = {
      completed: '',
      project: true,
      title: 'this / is done\nnext task',
      soft: '2019-06-17',
      tags: null,
      context: null,
    };
    const { add, update } = getUpdates(todo, true);
    expect(add).toBeFalsy();
    expect(update).toEqual(todo);
  });

  it('returns modified updates when completing project', () => {
    const { update } = getUpdates(project, true);
    expect(update).toEqual({
      completed: '',
      project: true,
      title: 'this / next task',
      soft: '2019-06-17',
      context: null,
      tags: null,
    });
  });

  it('works with non breaking space, replacing these with space', () => {
    const todo = {
      completed: 'yes',
      project: true,
      title: 'this /\xa0is done\nnext task',
      soft: '2019-06-17',
      tags: null,
      context: null,
    };
    const { add, update } = getUpdates(todo, true);
    expect(add.title).toBe('this / is done');
    expect(update.title).toEqual('this / next task');
  });
});

describe('todo mover', () => {
  const get = (todos) => async (id) => todos[id];
  const update = (todos) => async (id, updates) => {
    Object.assign(todos[id], updates);
  };
  const timestamp = (millis) => ({ toMillis: () => millis });

  it('moves down between two elements correctly', async () => {
    const todos = {
      1: { sortstamp: { toMillis: () => 1000 } },
      2: { sortstamp: { toMillis: () => 2000 } },
      3: { sortstamp: { toMillis: () => 3000 } },
    };
    await move('1', '2', '3', { get: get(todos), update: update(todos), timestamp });
    expect(todos[1].sortstamp.toMillis()).toEqual(2500);
  });

  it('moves up between two elements correctly', async () => {
    const todos = {
      1: { sortstamp: { toMillis: () => 1000 } },
      2: { sortstamp: { toMillis: () => 2000 } },
      3: { sortstamp: { toMillis: () => 3000 } },
    };
    await move('3', '1', '2', { get: get(todos), update: update(todos), timestamp });
    expect(todos[3].sortstamp.toMillis()).toEqual(1500);
  });

  it('moves to beginning of list', async () => {
    const todos = {
      1: { sortstamp: { toMillis: () => 60001 } },
      2: { sortstamp: { toMillis: () => 60002 } },
    };
    await move('2', undefined, '1', { get: get(todos), update: update(todos), timestamp });
    expect(todos[2].sortstamp.toMillis()).toEqual(1);
  });

  it('moves to end of list', async () => {
    const todos = {
      1: { sortstamp: { toMillis: () => 1 } },
      2: { sortstamp: { toMillis: () => 2 } },
    };
    await move('1', '2', undefined, { get: get(todos), update: update(todos), timestamp });
    expect(todos[1].sortstamp.toMillis()).toEqual(60002);
  });

  it('changes soft date and context to match "after" todo if exists', async () => {
    const todos = {
      1: {
        sortstamp: { toMillis: () => 1000 }, soft: '2020-04-22', context: '@a', title: '3 in @a',
      },
      2: {
        sortstamp: { toMillis: () => 2000 }, soft: '2020-04-23', context: '@b', title: '2 in @b',
      },
      3: {
        sortstamp: { toMillis: () => 3000 }, soft: '2020-04-23', context: '@b', title: '3 in @b',
      },
    };
    await move('3', '1', '2', { get: get(todos), update: update(todos), timestamp });
    expect(todos[3].soft).toEqual('2020-04-22');
    expect(todos[3].context).toEqual('@a');
    expect(todos[3].title).toEqual('3 in @a');
  });

  it('changes soft date and context to match "before" todo if no "after" todo exists', async () => {
    const todos = {
      1: {
        sortstamp: { toMillis: () => 1000 }, soft: '2020-04-22', context: '@a', title: '3 in @a',
      },
      2: {
        sortstamp: { toMillis: () => 2000 }, soft: '2020-04-23', context: '@b', title: '2 in @b',
      },
      3: {
        sortstamp: { toMillis: () => 3000 }, soft: '2020-04-23', context: '@b', title: '3 in @b',
      },
    };
    await move('3', undefined, '1', { get: get(todos), update: update(todos), timestamp });
    expect(todos[3].soft).toEqual('2020-04-22');
    expect(todos[3].context).toEqual('@a');
    expect(todos[3].title).toEqual('3 in @a');
  });
});
