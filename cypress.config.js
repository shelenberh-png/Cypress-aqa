const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
  },

  e2e: {
    baseUrl: 'https://guest:welcome2qauto@qauto.forstudy.space',
    setupNodeEvents(on, config) {
      // реалізація подій за потреби
    },
  },

  expose: {
    userEmail: 'yevgen1995@ukr.net',
  },

  env: {
    userPassword: 'Qwerty!123',
  },
});