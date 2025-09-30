const { test } = require('../Fixture/fixture');
const { expect } = require('@playwright/test');
const userResponseSchema = require('../schemas/userResponseSchema');
const { getUserResponseSchema } = require('../schemas/getUser');
const { SchemaValidator } = require('../utils/schemaValidator');
const { generateUser, payloadForList, SLA } = require('../utils/testData');


test.describe.serial('Swagger user test', () => {
    const baseUser = generateUser();
    const userPayload = payloadForList(baseUser);
    const validator = new SchemaValidator();
    test.slow();

    test('User CRUD lifecycle - create, get, update, delete', async ({ userApi }) => {
        // Single end-to-end test to keep operations in the same worker/process
        let localUsername = baseUser.username;
            // helper to retry GET until user is available or timeout
            const retryGetUser = async (username, attempts = 5, delayMs = 500) => {
                for (let i = 0; i < attempts; i++) {
                    const resp = await userApi.getUser(username);
                    if (resp.status() === 200) return resp;
                    // small delay
                    await new Promise((r) => setTimeout(r, delayMs));
                }
                // final attempt
                return await userApi.getUser(username);
            };

            const safeDelete = async (username) => {
                try {
                    const resp = await userApi.deleteUser(username);
                    // treat 404 as already deleted
                    if (resp.status() === 200) return resp;
                    if (resp.status() === 404) return resp;
                    return resp;
                } catch (err) {
                    // ignore
                }
            };
        try {
            await test.step('Create user via POST /user/createWithList', async () => {
                const startTime = Date.now();
                const response = await userApi.createUser(userPayload);
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                expect(responseTime).toBeLessThan(SLA.POST);
                expect(response.status()).toBe(200);
                const data = await response.json();
                console.log('responseDataPost :', data);
                expect(data).toHaveProperty('code', 200);
                validator.validateSchema(userResponseSchema, data);
            });

                    await test.step('Retrieve created user and validate schema', async () => {
                        const startTime = Date.now();
                        const response = await retryGetUser(localUsername);
                        const data = await response.json();
                        const endTime = Date.now();
                        const responseTime = endTime - startTime;
                        expect(responseTime).toBeLessThan(SLA.GET);
                        console.log('responseDataGet :', data);
                        expect(response.status()).toBe(200);
                        expect(response.ok()).toBeTruthy();
                        expect(data).toHaveProperty('id');
                        expect(data).toHaveProperty('email');
                        validator.validateSchema(getUserResponseSchema, data);
                    });

            await test.step('Update existing user and verify response', async () => {
                const newUsername = `Vivek_${Date.now()}`;
                const updatedUser = { ...baseUser, username: newUsername, phone: '3234546787' };
                const startTime = Date.now();
                const response = await userApi.updateUser(updatedUser, localUsername);
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                expect(responseTime).toBeLessThan(SLA.PUT);
                expect(response.status()).toBe(200);
                const data = await response.json();
                expect(data).toHaveProperty('message');
                console.log('Updated data :', data);
                validator.validateSchema(userResponseSchema, data);

                // update local username for subsequent delete
                localUsername = newUsername;
            });

                            await test.step('Delete user and validate response', async () => {
                                const startTime = Date.now();
                                const response = await safeDelete(localUsername);
                                const endTime = Date.now();
                                const responseTime = endTime - startTime;
                                expect(responseTime).toBeLessThan(SLA.DELETE);
                                // allow 200 or 404 (already deleted)
                                const status = response?.status?.() ?? 0;
                                expect([200, 404]).toContain(status);
                                let data = null;
                                if (status) {
                                    try {
                                        data = await response.json();
                                    } catch (err) {
                                        // empty body or non-json response
                                        data = null;
                                    }
                                }
                                // if 200, validate body
                                if (status === 200 && data) {
                                    expect(data).toHaveProperty('code', 200);
                                    expect(String(data.message)).toContain(String(localUsername));
                                    validator.validateSchema(userResponseSchema, data);
                                }
                            });

        } finally {
            // Ensure cleanup if anything left behind
            try {
                await userApi.deleteUser(localUsername);
            } catch (err) {
                // ignore cleanup errors
            }
        }
    });

    test.afterAll(async ({ userApi }) => {
        // dispose API context
        await userApi.disposeApi();
    });
});




// allure report generation
// # Allure Playwright reporter
//npm install -D allure-playwright

//# Allure command line (for generating HTML reports)
//npm install -g allure-commandline --save-dev

//allure --version
//allure generate allure-results --clean -o allure-report
//allure open allure-report
