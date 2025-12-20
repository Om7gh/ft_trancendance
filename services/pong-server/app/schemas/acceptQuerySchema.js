const querySchema = {
  querystring: {
    type: 'object',
    required: ['q', 'rid'],
    additionalProperties: false,
    properties: {
      q: { type: 'string', const: 'accept' },
      iid: { type: 'string', minLength: 10 },
    }
  }
};

export default querySchema;