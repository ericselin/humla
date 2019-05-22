import { todoSorter } from './firebase.js';

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
    arr.sort(todoSorter);
    expect(arr).toEqual([cb, ca1, ca2]);
  });

  it('sorts combination correctly', () => {
    const cas1 = { soft: '2019-05-01', context: '@a' };
    const cbs2 = { soft: '2019-05-02', context: '@b' };
    const cas4 = { soft: '2019-05-04', context: '@a' };
    const arr = [cas1, cas4, cbs2];
    arr.sort(todoSorter);
    expect(arr).toEqual([cbs2, cas1, cas4]);
  });
});
