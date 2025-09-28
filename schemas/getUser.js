// If using ESModules
const getUserResponseSchema = {
  type: "object",
  required: ["id", "username", "firstName", "lastName", "email", "password", "phone", "userStatus"],
  properties: {
    id: { type: "integer" },
    username: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string" },
    phone: { type: "string" },
    userStatus: { type: "integer" }
  },
  additionalProperties: false
};

export default getUserResponseSchema;
