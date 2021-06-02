module.exports = {
    launch: {
        dumpio: true,
        headless: false,
      },
    browser: 'chromium',
    browserContext: 'default',
    server: {
        command: 'npm start',
        port: 8080,
        launchTimeout: 10000,
        debug: true,
    },
}