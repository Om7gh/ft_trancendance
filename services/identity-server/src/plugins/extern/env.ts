import env from '@fastify/env'

declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      HOST: string
      PORT: number
      COOKIE_SECRET: string
      COOKIE_NAME: string
      COOKIE_SECURED: boolean
      RATE_LIMIT_MAX: number
      UPLOAD_DIRNAME: string
      UPLOAD_TASKS_DIRNAME: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      GOOGLE_REDIRECT_URI: string
      DISCORD_CLIENT_ID: string
      DISCORD_CLIENT_SECRET: string
      DISCORD_REDIRECT_URI: string
      SMTP_HOST: string
      SMTP_PORT: number
      SMTP_USER: string
      SMTP_PASS: string
      ACCESS_SECRET: string
      CONFIRM_SECRET: string
      REFRESH_SECRET: string
    }
  }
}

const schema = {
  type: 'object',
  required: [
    'HOST',
    'PORT',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'ACCESS_SECRET',
    'CONFIRM_SECRET',
    'REFRESH_SECRET',
  ],
  properties: {
    HOST: { type: 'string' },
    PORT: { type: 'number' },
    GOOGLE_CLIENT_ID: { type: 'string' },
    GOOGLE_CLIENT_SECRET: { type: 'string' },
    GOOGLE_REDIRECT_URI: {
      type: 'string',
      default: 'http://localhost:3000/auth/google/callback',
    },
    DISCORD_CLIENT_ID: { type: 'string' },
    DISCORD_CLIENT_SECRET: { type: 'string' },
    DISCORD_REDIRECT_URI: {
      type: 'string',
      default: 'http://localhost:3000/auth/discord/callback',
    },
    SMTP_HOST: { type: 'string' },
    SMTP_PORT: { type: 'number' },
    SMTP_USER: { type: 'string' },
    SMTP_PASS: { type: 'string' },
    ACCESS_SECRET: { type: 'string' },
    CONFIRM_SECRET: { type: 'string' },
    REFRESH_SECRET: { type: 'string' },
  },
}

export const autoConfig = {
  confKey: 'config',
  schema,
  dotenv: true,
  data: process.env,
}

/**
 * This plugins helps to check environment variables.
 *
 * @see {@link https://github.com/fastify/fastify-env}
 */
export default env
