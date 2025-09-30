// CommonJS export for schema
const getUserResponseSchema = {
  type: 'object',
  required: ['id', 'username', 'firstName', 'lastName', 'email', 'password', 'phone', 'userStatus'],
  properties: {
    id: { type: 'number' },
    username: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    phone: { type: 'string' },
    userStatus: { type: 'number' }
  },
  additionalProperties: false
};

module.exports = { getUserResponseSchema };
