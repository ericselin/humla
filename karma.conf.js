module.exports = (config) => {
  config.set({
    plugins: ['karma-jasmine', 'karma-chrome-launcher'],
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/**/*.spec.js', type: 'module' },
      { pattern: 'src/**/*.js', type: 'module', included: false },
    ],
    exclude: ['**/types.js'],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};
