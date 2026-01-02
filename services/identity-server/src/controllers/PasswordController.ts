import {
    FastifyInstance,
    type FastifyReply,
    type FastifyRequest,
} from 'fastify';
import { compare, hash } from '../auth/security/cipher-util.js';
import { Password } from '../models/password.js';
import { User } from '../models/user.js';
import { resetPasswordOptions } from '../utils/mail-options.js';
export class PasswordController {
    static readonly ERR_SIMILAR_PASSWORD: string =
        'The password is similar to the old one';
    static readonly ERR_INCORRECT_PASSWORD: string =
        'Current password is incorrect';
    static readonly ERR_ACCOUNT_NOT_FOUND: string =
        'No account is associated with this email address';
    static readonly ERR_PASSWORD_RESET_NOT_ALLOWED: string =
        'Password reset is only available for local accounts';

    static async resetPassword(request: FastifyRequest, reply: FastifyReply) {
        const fastify = request.server as FastifyInstance;
        const { newPassword, confirmPassword } = request.body as {
            newPassword: string;
            confirmPassword: string;
        };

        try {
            const { sub } = await request.verifyNonceToken();
            const user = fastify.usersRepository.findByUID(sub!);
            if (!user) {
                return reply.badRequest(
                    PasswordController.ERR_ACCOUNT_NOT_FOUND
                );
            }
            if (newPassword !== confirmPassword) {
                return reply.badRequest('password not match confirm password');
            }
            const hashedPassword = hash(newPassword);
            fastify.usersRepository.update(user.id, {
                password: hashedPassword,
            });
            reply.clearNonceToken();
            return reply.send({
                success: true,
                message: 'password changed successfuly',
            });
        } catch (err: any) {
            return reply.badRequest(err.message);
        }
    }

    static async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
        const { email } = request.body as { email: string };
        const fastify = request.server;
        const user = fastify.usersRepository.findByEmail(email);

        if (!user) {
            return reply.notFound(PasswordController.ERR_ACCOUNT_NOT_FOUND);
        }
        if (user.provider !== 'local') {
            return reply.forbidden(
                PasswordController.ERR_PASSWORD_RESET_NOT_ALLOWED
            );
        }
        const token = await fastify.generateNonceToken(user.email, '1h');
        const url = `${fastify.config.HOST}:${fastify.config.PORT}/auth/reset-password?token=${token}`;
        await fastify.transporter.sendMail(
            resetPasswordOptions(user.email, url)
        );

        reply.send({
            success: true,
            message: 'Please check your inbox for a password reset link.',
        });
    }

    static async updatePassword(request: FastifyRequest, reply: FastifyReply) {
        const { current_password, new_password } = request.body as Password;
        const user = request.user as User;
        const fastify: FastifyInstance = request.server;

        if (user.password != null) {
            if (!compare(current_password, user.password)) {
                return reply.badRequest(
                    PasswordController.ERR_INCORRECT_PASSWORD
                );
            }

            if (compare(new_password, user.password)) {
                return reply.badRequest(
                    PasswordController.ERR_SIMILAR_PASSWORD
                );
            }
        }

        fastify.usersRepository.update(user.id, {
            password: hash(new_password),
        });

        return reply.send({
            success: true,
            message: 'Password updated successfully',
        });
    }
}
