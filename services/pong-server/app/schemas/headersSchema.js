const headersSchema = {
  headers: {
    type: 'object',
    required: ['user'],
    additionalProperties: true,
    properties: {
      user: { type: 'string', minLength: 10 }
    }
  }
};

export default headersSchema;