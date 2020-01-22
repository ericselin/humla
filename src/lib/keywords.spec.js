import processTitle, { projectMatch } from './keywords.js';

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
    expect(results.soft).toBe('2020-05-03');
    expect(results.title).toBe('task due ');
  });

  it('creates context properly', () => {
    const results = processTitle('task with @context');
    expect(results.context).toBe('@context');
  });

  it('does not create context for email', () => {
    const results = processTitle('task with eric@gmail.com email and @context');
    expect(results.context).toBe('@context');
  });

  it('creates context when in the beginning', () => {
    const results = processTitle('@context task');
    expect(results.context).toBe('@context');
  });

  it('creates context when in the beginning of line', () => {
    const results = processTitle('task for this\n@context');
    expect(results.context).toBe('@context');
  });
});

describe('project matcher', () => {
  it('works with simple project', () => {
    const match = projectMatch('this is / a project\nwith some tasks');
    expect(match).toEqual({
      firstLine: 'this is / a project',
      nextAndFollowingStep: 'a project\nwith some tasks',
      followingStep: 'with some tasks',
    });
  });
});
