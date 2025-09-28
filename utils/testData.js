function payload(){
    return [
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
    ]
}
const SLA = { POST: 4000, GET: 3000, PUT: 3000, DELETE: 3000 };
module.exports={payload,SLA};