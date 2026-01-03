import Database, { Database as BetterDatabase } from 'better-sqlite3'

export default class DatabaseManager {
  private static dbInstance?: BetterDatabase

  static open(name: string, opts?: Database.Options): BetterDatabase {
    if (!this.dbInstance) {
      this.dbInstance = new Database(name, opts)
    }
    return this.dbInstance
  }

  static get db(): BetterDatabase {
    if (!this.dbInstance) {
      throw new Error('Database not open yet! Call DatabaseManager.open() first.')
    }
    return this.dbInstance
  }

  static close(): void {
    if (this.dbInstance) {
      this.dbInstance.close()
      this.dbInstance = undefined
    }
  }
}
