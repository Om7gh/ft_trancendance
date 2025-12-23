const userSchema = {
  body: {
    type: 'object',
    required: ['id', 'username', 'avatar'],
    additionalProperties: true,
    properties: {
      id: {
        type: 'string',
        minLength: 1
      },
      username: {
        type: 'string',
        minLength: 1
      },
      avatar: {
        type: 'string',
        minLength: 1
      }
    }
  }
};

export default userSchema;