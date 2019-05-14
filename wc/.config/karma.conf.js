module.exports = (config) => {
  config.set({
    plugins: ['karma-jasmine', 'karma-chrome-launcher'],
    frameworks: ['jasmine'],
    basePath: '..',
    files: [
      { pattern: '**/*.js', type: 'module', include: false },
      { pattern: '**/*.spec.js', type: 'module' },
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};
