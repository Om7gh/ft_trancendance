import { hashSync } from "@node-rs/argon2";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "crypto";

export default abstract class PasswordManager {
  static readonly config = {
    parallelism: 4,
    outputLen: 64,
    memoryCost: 65536,
    timeCost: 3,
  };

  private static getKeyBuffer(key: string): Buffer {
    return Buffer.from(key, "hex");
  }

  static hash(password: string, key: string): string {
    const salt = randomBytes(16);
    const hash = hashSync(password, {
      algorithm: 2,
      memoryCost: this.config.memoryCost,
      timeCost: this.config.timeCost,
      parallelism: this.config.parallelism,
      outputLen: this.config.outputLen,
      salt,
    });
    const combined = Buffer.concat([salt, Buffer.from(hash)]);
    return this.encode(combined, key);
  }

  static compare(password: string, storedHash: string, key: string): boolean {
    try {
      const { hash, salt } = this.decode(storedHash, key);
      const newHash = hashSync(password, {
        algorithm: 2,
        memoryCost: this.config.memoryCost,
        timeCost: this.config.timeCost,
        parallelism: this.config.parallelism,
        outputLen: this.config.outputLen,
        salt,
      });
      return timingSafeEqual(Buffer.from(newHash), hash);
    } catch (_err) {
      return false;
    }
  }

  static encrypt(data: string, key: string): string {
    const buffer = Buffer.from(data, "utf-8");
    return this.encode(buffer, key);
  }

  static decrypt(encrypted: string, key: string): string {
    const decrypted = this.decodeBuffer(encrypted, key);
    return decrypted.toString("utf-8");
  }

  static encode(data: Buffer, key: string): string {
    const keyBuffer = this.getKeyBuffer(key);
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", keyBuffer, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const ivB64 = iv.toString("base64").replace(/=/g, "");
    const tagB64 = authTag.toString("base64").replace(/=/g, "");
    const encryptedB64 = encrypted.toString("base64").replace(/=/g, "");
    return `${ivB64}$${tagB64}$${encryptedB64}`;
  }

  static decode(encoded: string, key: string): { hash: Buffer; salt: Buffer } {
    const keyBuffer = this.getKeyBuffer(key);
    const [ivB64, tagB64, encryptedB64] = encoded.split("$");
    if (!ivB64 || !tagB64 || !encryptedB64) {
      throw new Error("Invalid encrypted format");
    }
    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(tagB64, "base64");
    const encrypted = Buffer.from(encryptedB64, "base64");
    const decipher = createDecipheriv("aes-256-gcm", keyBuffer, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    const salt = decrypted.subarray(0, 16);
    const hash = decrypted.subarray(16);
    return { hash, salt };
  }

  static decodeBuffer(encoded: string, key: string): Buffer {
    const keyBuffer = this.getKeyBuffer(key);
    const [ivB64, tagB64, encryptedB64] = encoded.split("$");
    if (!ivB64 || !tagB64 || !encryptedB64) {
      throw new Error("Invalid encrypted format");
    }
    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(tagB64, "base64");
    const encrypted = Buffer.from(encryptedB64, "base64");
    const decipher = createDecipheriv("aes-256-gcm", keyBuffer, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}
