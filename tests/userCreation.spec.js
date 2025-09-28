import { test } from '../Fixture/fixture';
import {expect} from '@playwright/test';
import userResponseSchema from '../schemas/userResponseSchema';
const { SchemaValidator } = require('../utils/schemaValidator');
const {payload,SLA}=require('../utils/testData');
const{getUserResponseSchema}=require('../schemas/getUser');


test.describe.serial("Swagger user test",()=>{
    const userPayload = payload();
    let createdUsername ;
    const validator=new SchemaValidator();

    test("create user test",async({userApi})=>{ 
        const startTime=Date.now();
        const response= await userApi.createUser(userPayload);
        const endTime= Date.now();
        const responseTime=endTime-startTime;
        expect(responseTime).toBeLessThan(SLA.POST);
        expect(response.status()).toBe(200);
        const data=await response.json();
        console.log('reponseDataPost :',data);
        expect(data).toHaveProperty('code',200);
       createdUsername = userPayload[0].username; 
       validator.validateSchema(userResponseSchema,data);

    })

    test("Get User Test",async({userApi})=>{
        const startTime=Date.now();
        const response=await userApi.getUser(createdUsername);
        const data= await response.json();
        const endTime=Date.now();
        const responseTime=endTime-startTime;
        expect(responseTime).toBeLessThan(SLA.GET);
        console.log('reponseDataGet :', data);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('email');
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
       // validator.validateSchema(getUserResponseSchema,data);

    })

    test('Put User test',async({userApi})=>{
        const updateduserPayload = { ...userPayload,
                                   username:`Vivek@_${Date.now()}`,
                                   phone:'3234546787'
                                };
      
      const startTime=Date.now();
      const response=await userApi.updateUser(updateduserPayload,createdUsername);
      expect(response.status()).toBe(200);
      const data= await response.json();
      const endTime=Date.now();
      const responseTime=endTime-startTime;
      expect(responseTime).toBeLessThan(SLA.PUT);
      expect(data).toHaveProperty('message');
      console.log('Updated data :',data);
      validator.validateSchema(userResponseSchema,data);

    })
    test('delete user',async({userApi})=>{
        const startTime=Date.now();
        const response=await userApi.deleteUser(createdUsername);
        expect(response.status()).toBe(200);
        const data=await response.json();
        const endTime=Date.now();
        const responseTime=endTime-startTime;
        expect(responseTime).toBeLessThan(SLA.DELETE);
        expect(data).toHaveProperty("code", 200);
        expect(data).toHaveProperty("message", createdUsername);
        validator.validateSchema(userResponseSchema,data);

     })

    test.afterAll(async ({ userApi }) => {
    // Safe cleanup
    try {
      await userApi.deleteUser(createdUsername);
    } catch (err) {
      console.log("User already deleted, cleanup skipped.");
    }
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
