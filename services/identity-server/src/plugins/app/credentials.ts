import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { CredentialBody } from '../../auth/remote/types/provider-credentials.js';

declare module 'fastify' {
  interface FastifyInstance {
    providerConfig: ReturnType<typeof providerConfig>;
    mailerConfig: ReturnType<typeof mailerConfig>;
    tokenSecrets: ReturnType<typeof createTokenSecrets>;
  }
}

function providerConfig(fastify: FastifyInstance) {
  const { config } = fastify;
  const providerConfig: Record<string, CredentialBody> = {
    google: {
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      redirectURI: config.GOOGLE_REDIRECT_URI,
    },
    discord: {
      clientId: config.DISCORD_CLIENT_ID,
      clientSecret: config.DISCORD_CLIENT_SECRET,
      redirectURI: config.DISCORD_REDIRECT_URI,
    },
  };
  return providerConfig;
}

function mailerConfig(fastify: FastifyInstance) {
  const { config } = fastify;
  const mailerConfig = {
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  };
  return mailerConfig;
}

function createTokenSecrets(fastify: FastifyInstance) {
  const { config } = fastify;
  return {
    accessToken: config.ACCESS_SECRET,
    confirmToken: config.CONFIRM_SECRET,
    refreshToken: config.REFRESH_SECRET,
  };
}

export default fp(
  async (fastify) => {
    fastify.decorate('providerConfig', providerConfig(fastify));
    fastify.decorate('mailerConfig', mailerConfig(fastify));
    fastify.decorate('tokenSecrets', createTokenSecrets(fastify));
  },
  { name: 'provider-credentials', dependencies: ['@fastify/env'] }
);
