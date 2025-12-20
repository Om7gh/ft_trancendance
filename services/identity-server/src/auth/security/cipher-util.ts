import { hashSync } from '@node-rs/argon2'
import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'crypto'

const config = {
  parallelism: 4,
  outputLen: 64,
  memoryCost: 65536,
  timeCost: 3,
}

const ENCRYPTION_KEY =
  process.env.PASSWORD_ENCRYPTION_KEY ||
  Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex')

export function hash(password: string): string {
  const salt = randomBytes(16)
  const hash = hashSync(password, {
    algorithm: 2, // argon2id
    memoryCost: config.memoryCost,
    timeCost: config.timeCost,
    parallelism: config.parallelism,
    outputLen: config.outputLen,
    salt,
  })
  const combined = Buffer.concat([salt, Buffer.from(hash)])
  return encode(combined)
}

export function compare(password: string, storedHash: string): boolean {
  try {
    const { hash, salt } = decode(storedHash)
    const newHash = hashSync(password, {
      algorithm: 2, // argon2id
      memoryCost: config.memoryCost,
      timeCost: config.timeCost,
      parallelism: config.parallelism,
      outputLen: config.outputLen,
      salt,
    })
    return timingSafeEqual(Buffer.from(newHash), hash)
  } catch (_err) {
    return false
  }
}

export function encrypt(data: string): string {
  const buffer = Buffer.from(data, 'utf-8')
  return encode(buffer)
}

export function decrypt(encrypted: string): string {
  const decrypted = decodeBuffer(encrypted)
  return decrypted.toString('utf-8')
}

function encode(data: Buffer): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  const authTag = cipher.getAuthTag()

  const ivB64 = iv.toString('base64').replace(/=/g, '')
  const tagB64 = authTag.toString('base64').replace(/=/g, '')
  const encryptedB64 = encrypted.toString('base64').replace(/=/g, '')

  return `${ivB64}$${tagB64}$${encryptedB64}`
}

function decode(encoded: string): { hash: Buffer; salt: Buffer } {
  const [ivB64, tagB64, encryptedB64] = encoded.split('$')

  if (!ivB64 || !tagB64 || !encryptedB64) {
    throw new Error('Invalid encrypted format')
  }

  const iv = Buffer.from(ivB64, 'base64')
  const authTag = Buffer.from(tagB64, 'base64')
  const encrypted = Buffer.from(encryptedB64, 'base64')

  const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

  const salt = decrypted.subarray(0, 16)
  const hash = decrypted.subarray(16)

  return { hash, salt }
}

function decodeBuffer(encoded: string): Buffer {
  const [ivB64, tagB64, encryptedB64] = encoded.split('$')

  if (!ivB64 || !tagB64 || !encryptedB64) {
    throw new Error('Invalid encrypted format')
  }

  const iv = Buffer.from(ivB64, 'base64')
  const authTag = Buffer.from(tagB64, 'base64')
  const encrypted = Buffer.from(encryptedB64, 'base64')

  const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}
