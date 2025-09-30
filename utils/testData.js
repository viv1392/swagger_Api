function generateUser(overrides = {}){
    const unique = Date.now();
    return {
      id: unique,
      username: `vivek_${unique}`,
      firstName: 'Vivek',
      lastName: 'Pandey',
      email: `vivek.${unique}@example.com`,
      password: 'P@ssw0rd!',
      phone: '1234546780',
      userStatus: 0,
      ...overrides
    };
}

function payloadForList(user){
    // API expects an array for createWithList
    return [user];
}

const SLA = { POST: 4000, GET: 3000, PUT: 3000, DELETE: 3000 };

module.exports = { generateUser, payloadForList, SLA };