const acceptQuerySchema = {
  querystring: {
    type: 'object',
    required: ['iid'],
    additionalProperties: false,
    properties: {
      iid: { type: 'string', minLength: 10 },
    }
  }
};

export default acceptQuerySchema;