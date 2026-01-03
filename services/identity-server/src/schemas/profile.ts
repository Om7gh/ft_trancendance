import { Type } from '@fastify/type-provider-typebox';

export const updatePasswordSchema = Type.Object({
  current_password: Type.String({ minLength: 8 }),
  new_password: Type.String({ minLength: 8 })
})
