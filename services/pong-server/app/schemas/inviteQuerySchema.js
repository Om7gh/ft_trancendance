const inviteQuerySchema = {
  querystring: {
    type: 'object',
    required: ['fid'],
    additionalProperties: true,
    properties: {
      fid: { type: 'string', minLength: 10 },
    }
  }
};

export default inviteQuerySchema;