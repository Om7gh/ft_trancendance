const acceptSchema = {
  querystring: {
    type: 'object',
    required: ['rid'],
    additionalProperties: false,
    properties: {
      rid: { type: 'string', minLength: 10 },
    }
  }
};

export default acceptSchema;