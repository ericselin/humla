module.exports = wallaby => ({
  files: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  tests: [
    'src/**/*.test.js',
  ],
  env: {
    type: 'node',
    runner: 'node',
  },
  compilers: {
    'src/**/*.test.js': wallaby.compilers.babel({
      presets: ['@ava/babel-preset-stage-4'],
    }),
    'src/**/*.js': wallaby.compilers.babel({
      presets: ['@ava/babel-preset-stage-4'],
    }),
  },
  testFramework: 'ava',
});
