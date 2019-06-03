module.exports = () => ({
  files: [
    { pattern: 'src/lib/*.js', load: false },
    { pattern: 'src/*.js', load: false },
    '!**/*.spec.js',
    '!wallaby.js',
  ],
  tests: ['src/**/*.spec.js'],
  env: {
    kind: 'chrome',
  },
  debug: true,
});
