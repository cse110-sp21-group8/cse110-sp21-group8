module.exports = {
  launch: {
    dumpio: false,
    headless: false,
    slowMo: 500,
    product: 'chromium'
  },
  browserContext: 'default',
  server: {
    command: 'npm start',
    port: 8080,
    debug: true
  }
};
