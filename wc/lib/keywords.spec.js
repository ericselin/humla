import processTitle from './keywords.js';

describe('title processing', () => {
  it('returns tags', () => {
    const results = processTitle('this is a #tag and another #one');
    expect(results.tags).toEqual(['#tag', '#one']);
  });
});
