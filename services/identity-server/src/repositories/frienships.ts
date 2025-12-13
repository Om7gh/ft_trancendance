import { Database } from 'better-sqlite3'
import { Friend, Friendship } from '../models/friendship';

export class FriendshipRepository {
  constructor(private db: Database) {}

  private allowedColumns = new Set([
    'status',
    'updated_at'
  ])

  private validateColumns(keys: string[]): void {
    for (const key of keys) {
      if (!this.allowedColumns.has(key)) {
        throw new Error(`Invalid column: "${key}"`)
      }
    }
  }

  get(id: number = -1, user_id: number = -1, friend_id: number = -1, status: number = -1): Friendship[] {
    const conditions: string[] = [];
    const params: any[] = [];

    if (id != -1) {
      conditions.push('f.id = ?');
      params.push(id);
    }
    if (user_id != -1) {
      conditions.push('f.sender_id = ?');
      params.push(user_id);
    }
    if (friend_id != -1) {
      conditions.push('f.receiver_id = ?');
      params.push(friend_id);
    }
    if (status != -1) {
      conditions.push('f.status = ?');
      params.push(status);
    }

    if (conditions.length == 0) {
      throw new Error("No filter was provided");
    }

    const query = `
      SELECT
        f.*,
        u.username as sender_username,
        uu.username as receiver_username,
        CONCAT(u.firstname, ' ', u.lastname) AS sender_fullname,
        CONCAT(uu.firstname, ' ', uu.lastname) AS receiver_fullname,
        u.avatar as sender_avatar,
        uu.avatar as receiver_avatar
      FROM friendships f
      JOIN users u on f.sender_id = u.id
      JOIN users uu on f.receiver_id = uu.id
      WHERE ${conditions.join(' AND ')}
    `;
    return this.db.prepare(query).all(...params)
  }

  insert(data: Pick<Friendship, 'sender_id' | 'receiver_id'>): void {
    const query: string = `
      INSERT INTO friendships('sender_id', 'receiver_id') VALUES (?, ?)
    `;
    this.db.prepare(query).run(data.sender_id, data.receiver_id);
  }

  update(id: number, data: Pick<Friendship, 'status'>): void {
    const updates: string[] = []
    const values: any[] = []

    this.validateColumns(Object.keys(data))

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`)
      values.push(value)
    })

    values.push(Math.floor(Date.now() / 1000))
    values.push(id)

    const result = this.db
      .prepare(`UPDATE friendships SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`)
      .run(...values)
    if (result.changes === 0) {
      throw new Error('User not found')
    }

    
  }

  delete(id: number = -1): void {
    const conditions: string[] = [];
    const params: any[] = [];

    if (id != -1) {
      conditions.push('f.id = ?');
      params.push(id);
    }

    if (conditions.length == 0) {
      throw new Error("No filter was provided");
    }

    const query: string = `
      DELETE from friendships
      WHERE ${conditions.join(' AND ')}
    `;
    if (this.db.prepare(query).run(id) == 0)
      throw new Error('No Record was found with the provided payload');
  }
}