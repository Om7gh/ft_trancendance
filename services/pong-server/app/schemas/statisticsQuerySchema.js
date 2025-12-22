const statisticsQuerySchema = {
  querystring: {
    type: 'object',
    required: ['uid'],
    additionalProperties: true,
    properties: {
      fid: { type: 'string', minLength: 10 },
    }
  }
};

export default statisticsQuerySchema;