import { Static, Type } from '@fastify/type-provider-typebox';

export const OAuth2Schema = Type.Object({ provider: Type.String() });

export type OAuth2Body = Static<typeof OAuth2Schema>;

export const QuerySchema = Type.Object({
    state: Type.String(),
    code: Type.Optional(Type.String()),
    error: Type.Optional(Type.String()),
});

export type OAuth2CallbackBody = Static<typeof QuerySchema>;

export const CallbackSchema = {
    params: OAuth2Schema,
    querystring: QuerySchema,
};

export const RegisterCredentials = Type.Object({
    email: Type.String(),
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

export const UsernameSchema = Type.Object({
    username: Type.String({
        minLength: 3,
        maxLength: 10,
        pattern: '^[a-zA-Z0-9_]+$',
    }),
});

export type UsernameBody = Static<typeof UsernameSchema>;

export const TwoFASchema = Type.Object({
    code: Type.String({
        minLength: 6,
        maxLength: 6,
        pattern: '^[0-9]+$',
    }),
});

export type TwoFABody = Static<typeof TwoFASchema>;
