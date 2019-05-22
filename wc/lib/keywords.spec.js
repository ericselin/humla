import processTitle from './keywords.js';

describe('title processing', () => {
  it('returns tags', () => {
    const results = processTitle('this is a #tag and another #one');
    expect(results.tags).toEqual(['#tag', '#one']);
  });

  it('returns context', () => {
    const results = processTitle('this is a @context');
    expect(results.context).toEqual('@context');
  });

  it('parses projects', () => {
    const results = processTitle('project / task 1\ntask 2\n\n@context');
    expect(results.project).toBe(true);
  });

  it('does not create project when context next', () => {
    const results = processTitle('project / task 1\n@context');
    expect(results.project).toBeFalsy();
  });

  it('does not create project on last todo', () => {
    const results = processTitle('project / task 1\n\n@context');
    expect(results.project).toBeFalsy();
  });

  it('works with dates', () => {
    const results = processTitle('task due !3.5');
    expect(results.soft).toBe('2019-05-03');
    expect(results.title).toBe('task due ');
  });
});
