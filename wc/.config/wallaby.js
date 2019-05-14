module.exports = () => ({
  files: [
    { pattern: 'lib/*.js', load: false },
    '!**/*.spec.js',
  ],
  tests: ['lib/*.spec.js'],
  env: {
    kind: 'chrome',
  },
  debug: true,
});
