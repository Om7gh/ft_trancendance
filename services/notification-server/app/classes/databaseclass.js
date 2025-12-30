export default class DatabaseService {
    constructor(db) {
        this.db = db;

        this.insertUser = this.db.prepare(`
            INSERT OR IGNORE INTO users (id, username, avatar)
            VALUES (@id, @username, @avatar)
        `);

        this.insertNotification = this.db.prepare(`
            INSERT OR IGNORE INTO notifications (
                id, type, sender_id, receiver_id, expire_time
            ) VALUES (@id, @type, @sender_id, @receiver_id, @expire_time)
        `);

        this.fetchNotificationsByUser = this.db.prepare(`
            SELECT
                n.id AS notification_id,
                n.type,
                n.receiver_id,
                n.expire_time,
                u.id AS sender_id, u.username AS sender_username, u.avatar AS sender_avatar
            FROM notifications n
            JOIN users u ON n.sender_id = u.id
            WHERE n.receiver_id = ?
            ORDER BY n.created_at DESC
        `);
    }

    addNotification({ id, type, sender, receiver, expireTime }) {

        this.insertUser.run(sender);

        console.log(expireTime, typeof(expireTime));

        this.insertNotification.run({
            id,
            type,
            sender_id: sender.id,
            receiver_id: receiver.id,
            expire_time:  expireTime
        });

        return id;
    }

    getNotificationsByUser(userId) {
        
        const rows = this.fetchNotificationsByUser.all(userId);

        return rows.map(r => ({
            id: r.notification_id,
            type: r.type,
            expireTime: r.expire_time,
            sender: {
                id: r.sender_id,
                username: r.sender_username,
                avatar: r.sender_avatar,
            },
            receiver: {
                id: r.receiver_id,
            }
        }));
    }
}
