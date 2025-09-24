const base = require('@playwright/test').test;
const { apiUser } = require('../apiUser/userApi');

const test = base.extend({
  userApi: async ({ request }, use) => {
    await use(new apiUser(request));
  },
});

module.exports = { test};