import { Database } from 'better-sqlite3';
import type { User } from '../models/user.js';

export class UserRepository {
    constructor(private db: Database) {}

    private allowedColumns = new Set([
        'username',
        'email',
        'first_name',
        'last_name',
        'password',
        'avatar',
        'bio',
        'last_login',
        'last_logout',
        'email_verified',
        'provider',
        'token_id',
    ]);

    private validateColumns(keys: string[]): void {
        for (const key of keys) {
            if (!this.allowedColumns.has(key)) {
                throw new Error(`Invalid column: "${key}"`);
            }
        }
    }

    findOrCreate(data: Omit<User, 'id'>): User {
        let user = this.findByEmail(data.email);
        if (user) {
            return user;
        }

        try {
            user = this.insert(data);
            return user;
        } catch (err: any) {
            throw new Error('failed to find or create user.');
        }
    }

    insert(user: Omit<User, 'id'>): User {
        const result = this.db
            .prepare(
                `INSERT INTO users (
                username,
                email,
                first_name,
                last_name,
                password,
                avatar,
                bio,
                last_login,
                email_verified,
                provider,
                token_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                user.username,
                user.email,
                user.first_name,
                user.last_name,
                user.password,
                user.avatar,
                user.bio,
                user.last_login,
                user.email_verified ? 1 : 0,
                user.provider,
                user.token_id
            );

        const newUser = this.findById(Number(result.lastInsertRowid));
        if (!newUser) throw new Error('Failed to create user');
        return newUser;
    }

    findById(id: number): User | null {
        return this.db
            .prepare('SELECT * FROM users WHERE id = ?')
            .get(id) as User | null;
    }

    findByUID(uid: string): User | null {
        return this.db
            .prepare('SELECT * FROM users WHERE uid = ?')
            .get(uid) as User | null;
    }

    findByEmail(email: string): User | null {
        return this.db
            .prepare('SELECT * FROM users WHERE email = ?')
            .get(email) as User | null;
    }

    findByUsername(username: string): User | null {
        return this.db
            .prepare('SELECT * FROM users WHERE username = ?')
            .get(username) as User | null;
    }

    findAll(): User[] {
        return this.db.prepare('SELECT * FROM users').all() as User[];
    }

    update(id: number, data: Partial<Omit<User, 'id' | 'created_at'>>): void {
        const updates: string[] = [];
        const values: any[] = [];

        this.validateColumns(Object.keys(data));

        Object.entries(data).forEach(([key, value]) => {
            updates.push(`${key} = ?`);
            values.push(value);
        });

        values.push(Math.floor(Date.now() / 1000));
        values.push(id);

        const result = this.db
            .prepare(
                `UPDATE users SET ${updates.join(
                    ', '
                )}, updated_at = ? WHERE id = ?`
            )
            .run(...values);
        if (result.changes === 0) {
            throw new Error('User not found');
        }
    }

    searchUsers(query: string, limit = 50): User[] {
        const likeQuery = `%${query}%`;
        const stmt = this.db.prepare(`
      SELECT
        uid,
        username,
        first_name,
        last_name,
        avatar,
        bio,
        created_at,
        updated_at,
        last_login,
        last_logout
      FROM users
      WHERE username LIKE ? OR first_name LIKE ? OR last_name LIKE ?
      LIMIT ?
    `);
        return stmt.all(likeQuery, likeQuery, likeQuery, limit) as User[];
    }

    delete(id: number): boolean {
        const result = this.db
            .prepare('DELETE FROM users WHERE id = ?')
            .run(id);
        return result.changes > 0;
    }
}
