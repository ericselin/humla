module.exports = wallaby => ({
  files: ['lib/*.js', '!**/*.test.js', '!**/*.spec.js'],
  tests: ['lib/*.spec.js'],
  env: {
    kind: 'chrome',
  },
  compilers: {
    '**/*.js': wallaby.compilers.babel({
      babelrc: false,
    }),
  },
  debug: true,
});
