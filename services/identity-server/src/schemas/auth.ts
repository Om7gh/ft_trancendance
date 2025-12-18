import { Static, Type } from '@fastify/type-provider-typebox';

export const RegisterCredentials = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  //TODO add confirm password check in server side
  first_name: Type.String(),
  last_name: Type.Optional(Type.String()),
});

export type RegisterBody = Static<typeof RegisterCredentials>;

export const LoginCredentials = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

export type LoginBody = Static<typeof LoginCredentials>;

export const ConfirmToken = Type.Object({ token: Type.String() });

export const UsernameSchema = Type.Object({ username: Type.String() });

export type UsernameBody = Static<typeof UsernameSchema>;

export const TwoFASchema = Type.Object({ code: Type.String() });

export type TwoFABody = Static<typeof TwoFASchema>;
