const { defineConfig } = require("cypress");
const mainConfig = require("./cypress.config");

module.exports = defineConfig({
  ...mainConfig,

  e2e: {
    ...mainConfig.e2e,
    baseUrl: 'https://guest:welcome2qauto@qauto2.forstudy.space',
  },

  expose: {
    userEmail: 'shelenberh@gmail.com',
  },

  env: {
    userPassword: 'Qwerty!123',
  },
});