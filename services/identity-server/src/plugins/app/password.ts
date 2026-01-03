import fp from "fastify-plugin";
import PasswordManager from "../../auth/security/cipher-util.js";

declare module "fastify" {
  interface FastifyInstance {
    passwordManager: typeof PasswordManager;
  }
}

export default fp(
  async (fastify) => {
    fastify.decorate("passwordManager", PasswordManager);
  },
  { name: "passwordManager" }
);
