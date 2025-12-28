import { Type } from '@fastify/type-provider-typebox';

export const updateUserSchema = {
  body: Type.Object({
    username: Type.Optional(Type.String()),
    first_name: Type.Optional(Type.String({
      pattern: '^[\\p{L}]+$',
      minLength: 1,
      maxLength: 50
    })),
    last_name: Type.Optional(Type.String({
      pattern: '^[\\p{L}]+$',
      minLength: 1,
      maxLength: 50
    })),
    bio: Type.Optional(Type.String({
      maxLength: 300
    })),
    avatar: Type.Optional(Type.String())
  }, {
    minProperties: 1
  })
}

const passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$'

const PasswordSchema = Type.String({
  pattern: passwordPattern,
  minLength: 8
})

export const updatePasswordSchema = Type.Object({
  current_password: PasswordSchema,
  new_password: PasswordSchema
})