import { Type } from '@fastify/type-provider-typebox';

const uidSchema = Type.Object({
  username: Type.String()
});

export const uidBodySchema = {
  body: uidSchema
}

export const uidParamsSchema = {
  params: uidSchema
}