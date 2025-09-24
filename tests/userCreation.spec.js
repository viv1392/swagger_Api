
import { apiUser } from '../apiUser/userApi';
import { baseURL } from '../config/Config';
import { test } from '../Fixture/fixture';
import {expect} from '@playwright/test';
import userResponseSchema from '../schemas/userResponseSchema';
const { SchemaValidator } = require('../utils/schemaValidator');


test.describe.serial("Swagger user test",()=>{

    let createdUsername ;
    const validator=new SchemaValidator();
    test("create user test",async({userApi})=>{

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
        const response= await userApi.createUser(userPayload);
        const endTime= Date.now();
        const responseTime=endTime-startTime;
        expect(responseTime).toBeLessThan(4000);
        expect(response.status()).toBe(200);
        const data=await response.json();
        console.log('reponseDataPost :',data);
        expect(data).toHaveProperty('code',200);
       createdUsername = userPayload[0].username; 
       validator.validateSchema(userResponseSchema,data);

    })

    test("Get User Test",async({userApi})=>{
        const response=await userApi.getUser(createdUsername);
        const data= await response.json();
        console.log('reponseDataGet :', data);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('email');
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

    })

    test('Put User test',async({userApi})=>{
        const userPayload = {
                                    id: Date.now(), // unique id
                                    username: "vivek123",
                                    firstName: "Vivek",
                                    lastName: "Pandey",
                                    email: "abc@gmail.com",
                                    password: "1234567",
                                    phone: "1234546780",
                                    userStatus: 0
                                };
                             

      const response=await userApi.updateUser(userPayload,createdUsername);
      expect(response.status()).toBe(200);
      const data= await response.json();
      expect(data).toHaveProperty('message');
      console.log('Updated data :',data);

    })
    test('delete user',async({userApi})=>{
        const response=await userApi.deleteUser(createdUsername);
        expect(response.status()).toBe(200);
        const data=await response.json();
        expect(data).toHaveProperty("code", 200);
        expect(data).toHaveProperty("message", createdUsername);

     })

     test('tear down',async({userApi})=>{
       await userApi.apiTear();
        
     })
})

//npm install --save-dev allure-playwright

//npx allure generate ./allure-results --clean -o ./allure-report
//npx allure open ./allure-report
