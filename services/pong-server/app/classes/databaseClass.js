export default class DatabaseService {
    constructor(db) {
        this.db = db;

        this.insertUser = this.db.prepare(`
            INSERT OR IGNORE INTO users (id, username, avatar)
            VALUES (@id, @username, @avatar)
        `);

        this.insertMatch = this.db.prepare(`
            INSERT OR IGNORE INTO matches (
                id, left_player_id, left_player_points,
                right_player_id, right_player_points, winner_id
            ) VALUES (
                @id, @left_player_id, @left_points,
                @right_player_id, @right_points, @winner_id
            )
        `);

        this.insertCustomization = this.db.prepare(`
            INSERT OR IGNORE INTO matches (
                id, left_player_id, left_player_points,
                right_player_id, right_player_points, winner_id
            ) VALUES (
                @id, @left_player_id, @left_points,
                @right_player_id, @right_points, @winner_id
            )
        `);

        this.fetchMatchesByUser = this.db.prepare(`
            SELECT
                m.id AS match_id,
                m.winner_id,
                u1.id AS left_id, u1.username AS left_username, u1.avatar AS left_avatar, m.left_player_points AS left_points,
                u2.id AS right_id, u2.username AS right_username, u2.avatar AS right_avatar, m.right_player_points AS right_points
            FROM matches m
            JOIN users u1 ON m.left_player_id = u1.id
            JOIN users u2 ON m.right_player_id = u2.id
            WHERE m.left_player_id = ? OR m.right_player_id = ?
            ORDER BY m.created_at DESC
        `);
    }

    addUser({ id, username, avatar }) {
        this.insertUser.run({ id, username, avatar });
    }

    addMatch({ id, leftPlayer, rightPlayer, winner }) {

        this.addUser(leftPlayer);
        this.addUser(rightPlayer);

        this.insertMatch.run({
            id,
            left_player_id: leftPlayer.id,
            left_points: leftPlayer.points,
            right_player_id: rightPlayer.id,
            right_points: rightPlayer.points,
            winner_id: winner.id
        });

        return id;
    }

    getMatchesByUser(userId) {
        const rows = this.fetchMatchesByUser.all(userId, userId);

        return rows.map(r => ({
            id: r.match_id,
            winner: r.winner_id,
            leftPlayer: {
                id: r.left_id,
                username: r.left_username,
                avatar: r.left_avatar,
                points: r.left_points
            },
            rightPlayer: {
                id: r.right_id,
                username: r.right_username,
                avatar: r.right_avatar,
                points: r.right_points
            }
        }));
    }
}
