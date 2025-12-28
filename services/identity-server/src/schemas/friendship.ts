import { Type } from '@fastify/type-provider-typebox';

const uidSchema = Type.Object({
  uid: Type.String()
});

export const uidBodySchema = {
  body: uidSchema
}

export const uidParamsSchema = {
  params: uidSchema
}