import { Database } from 'better-sqlite3'
import type { TwoFactor } from '../models/user.js'

export class TwoFactorRepository {
  constructor(private db: Database) {}

  private allowedColumns = new Set(['user_id', 'secret', 'enabled'])

  private validateColumns(keys: string[]): void {
    for (const key of keys) {
      if (!this.allowedColumns.has(key)) {
        throw new Error(`Invalid column: "${key}"`)
      }
    }
  }

  create(twoFactor: Omit<TwoFactor, 'id' | 'created_at'>): TwoFactor {
    const result = this.db
      .prepare(`INSERT INTO tfa (user_id, secret, enabled) VALUES (?, ?, ?)`)
      .run(twoFactor.user_id, twoFactor.secret, twoFactor.enabled)

    const newTFA = this.findById(Number(result.lastInsertRowid))
    if (!newTFA) throw new Error('Failed to create 2FA')
    return newTFA
  }

  findById(id: number): TwoFactor | null {
    return this.db.prepare('SELECT * FROM tfa WHERE id = ?').get(id) as TwoFactor | null
  }

  findByUserId(userId: number): TwoFactor | null {
    return this.db.prepare('SELECT * FROM tfa WHERE user_id = ?').get(userId) as TwoFactor | null
  }

  findAll(): TwoFactor[] {
    return this.db.prepare('SELECT * FROM tfa').all() as TwoFactor[]
  }

  update(user_id: number, data: Partial<Omit<TwoFactor, 'id' | 'created_at'>>): void {
    const updates: string[] = []
    const values: any[] = []

    this.validateColumns(Object.keys(data))

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`)
      values.push(value)
    })

    values.push(user_id)
    const result = this.db
      .prepare(`UPDATE tfa SET ${updates.join(', ')} WHERE user_id = ?`)
      .run(...values)
    if (result.changes === 0) {
      throw new Error(`No 2FA record found with id: ${user_id}`)
    }
  }

  delete(user_id: number): boolean {
    const result = this.db.prepare('DELETE FROM tfa WHERE user_id = ?').run(user_id)
    return result.changes > 0
  }
}
