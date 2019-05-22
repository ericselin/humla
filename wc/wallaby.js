module.exports = () => ({
  files: [
    { pattern: 'lib/*.js', load: false },
    { pattern: '*.js', load: false },
    '!**/*.spec.js',
    '!wallaby.js',
  ],
  tests: ['**/*.spec.js'],
  env: {
    kind: 'chrome',
  },
  debug: true,
});
