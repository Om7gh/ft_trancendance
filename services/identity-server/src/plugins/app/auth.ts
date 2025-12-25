import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import nodemailer from 'nodemailer';
import { AuthManager } from '../../auth/index.js';
import Discord from '../../auth/remote/providers/discord.js';
import Google from '../../auth/remote/providers/google.js';

declare module 'fastify' {
  interface FastifyInstance {
    auth: typeof AuthManager;
    // pkce: Pkce;
    transporter: ReturnType<typeof createTransporter>;
  }
}

function createTransporter(fastify: FastifyInstance) {
  const transporter = nodemailer.createTransport({
    host: fastify.config.SMTP_HOST,
    port: fastify.config.SMTP_PORT,
    secure: false, //TODO should be true in production
    auth: {
      user: fastify.config.SMTP_USER,
      pass: fastify.config.SMTP_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });
  return transporter;
}

export default fp(
  async (fastify) => {
    AuthManager.register(new Google(fastify.providerConfig.google));
    AuthManager.register(new Discord(fastify.providerConfig.discord));

    // fastify.decorate('pkce', new Pkce());
    fastify.decorate('auth', AuthManager);
    fastify.decorate('transporter', createTransporter(fastify));
  },
  { name: 'auth-manager', dependencies: ['provider-credentials'] }
);
