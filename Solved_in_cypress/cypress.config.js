const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://automationintesting.online',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    baseApiUrl: 'https://restful-booker.herokuapp.com', 
  },
})
