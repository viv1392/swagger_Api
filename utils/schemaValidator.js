const Ajv = require('ajv');

class SchemaValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
  }
   validateSchema(schema, data) {
    const validate = this.ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      throw new Error(
        `❌ Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`
      );
    }
    console.log('✅ Schema validation passed');
  }
}

module.exports = { SchemaValidator };
