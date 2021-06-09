module.exports = {
  launch: {
    dumpio: false,
    headless: false,
    slowMo: 500
  },
  browser: 'chromium',
  browserContext: 'default',
  server: {
    command: 'npm start',
    port: 8080,
    debug: true
  }
};
