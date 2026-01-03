import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import AuthController from '../../controllers/AuthController.js';
import { PasswordController } from '../../controllers/PasswordController.js';
import {
    ConfirmToken,
    LoginCredentials,
    RegisterCredentials,
    UsernameSchema,
} from '../../schemas/auth.js';
import TokenController from '../../controllers/TokenController.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post(
        '/signup',
        { schema: { body: RegisterCredentials } },
        AuthController.signup
    );

    fastify.post(
        '/login',
        { schema: { body: LoginCredentials } },
        AuthController.login
    );

    fastify.post(
        '/logout',
        { onRequest: [fastify.authenticate] },
        AuthController.logout
    );

    fastify.get(
        '/confirm',
        { schema: { querystring: ConfirmToken } },
        AuthController.confirmEmail
    );

        fastify.get(
            '/auto-login',
            { schema: { querystring: ConfirmToken } },
            AuthController.autoLogin
        );

    fastify.post(
        '/check-username',
        {
            onRequest: [fastify.trackPendingUser],
            schema: { body: UsernameSchema },
        },
        AuthController.checkUsername
    );

    fastify.post(
        '/set-username',
        {
            onRequest: [fastify.trackPendingUser],
            schema: { body: UsernameSchema },
        },
        AuthController.setUsername
    );

    fastify.post(
        '/complete-profile',
        { onRequest: [fastify.trackPendingUser] },
        AuthController.completeProfile
    );

    fastify.get(
        '/userinfo',
        { onRequest: [fastify.authenticate] },
        AuthController.userInfo
    );

    fastify.post('/forgot-password', PasswordController.forgotPassword);

    fastify.post('/reset-password', PasswordController.resetPassword);

    fastify.get('/verify-token', TokenController.verifyToken)
};

export default plugin;
