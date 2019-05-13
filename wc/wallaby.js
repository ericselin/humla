module.exports = () => ({
  files: [
    { pattern: 'lib/*.js', load: false },
    {
      pattern: 'node_modules/mockdate/src/mockdate.js',
      instrument: false,
      load: false,
    },
    '!**/*.test.js',
    '!**/*.spec.js',
  ],
  tests: ['lib/*.spec.js'],
  env: {
    kind: 'chrome',
  },
  debug: true,
});
