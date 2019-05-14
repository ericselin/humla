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
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    singleRun: true, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
  });
};
