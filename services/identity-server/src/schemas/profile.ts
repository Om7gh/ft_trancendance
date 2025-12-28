import { Type } from '@fastify/type-provider-typebox';

const passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$'

const PasswordSchema = Type.String({
  pattern: passwordPattern,
  minLength: 8
})

export const updatePasswordSchema = Type.Object({
  current_password: PasswordSchema,
  new_password: PasswordSchema
})