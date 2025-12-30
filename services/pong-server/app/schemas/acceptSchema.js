const acceptSchema = {
  querystring: {
    type: 'object',
    required: ['sid'],
    additionalProperties: false,
    properties: {
      sid: { type: 'string', minLength: 10 },
    }
  }
};

export default acceptSchema;