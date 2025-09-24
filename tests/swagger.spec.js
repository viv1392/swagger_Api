const { test, expect } = require('@playwright/test');

test('Create Users in Petstore', async ({ request }) => {
   const userPayload = [
      {
        id: Date.now(), // unique id
        username: "vivek123",
        firstName: "Vivek",
        lastName: "Pandey",
        email: "xyz@gmail.com",
        password: "1234567",
        phone: "1234546780",
        userStatus: 0
      }
    ];
  const startTime=Date.now();

  const response = await request.post('https://petstore.swagger.io/v2/user/createWithList', {
    headers: {
      'Content-Type': 'application/json',
      'api_key':' special-key'
    },
    data: userPayload
  });
  const endTime=Date.now();
  const timeTaken=endTime-startTime;

  expect(timeTaken).toBeLessThan(3000);
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log('Response:', responseBody);
  expect(responseBody).toHaveProperty('message');
});
