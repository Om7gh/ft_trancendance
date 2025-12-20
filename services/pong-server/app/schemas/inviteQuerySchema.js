const inviteQuerySchema = {
  querystring: {
    type: 'object',
    required: ['fid'],
    additionalProperties: false,
    properties: {
      fid: { type: 'string', minLength: 10 },
    }
  }
};

export default inviteQuerySchema;