const userSchema = {
  body: {
    type: 'object',
    required: ['id', 'username'],
    additionalProperties: true,
    properties: {
      id: {
        type: 'string',
        minLength: 1
      },
      username: {
        type: 'string',
        minLength: 1
      }
    }
  }
};

export default userSchema;