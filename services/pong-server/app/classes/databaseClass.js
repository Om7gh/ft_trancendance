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

        this.insertPongCustomizations = this.db.prepare(`
            INSERT INTO pong_customizations (
                id,
                ball_color,
                left_paddle_color,
                right_paddle_color,
                table_edges_color
            ) VALUES (
                @id,
                @ball_color,
                @left_paddle_color,
                @right_paddle_color,
                @table_edges_color
            )
            ON CONFLICT(id) DO UPDATE SET
                ball_color          = COALESCE(excluded.ball_color, pong_customizations.ball_color),
                left_paddle_color   = COALESCE(excluded.left_paddle_color, pong_customizations.left_paddle_color),
                right_paddle_color  = COALESCE(excluded.right_paddle_color, pong_customizations.right_paddle_color),
                table_edges_color   = COALESCE(excluded.table_edges_color, pong_customizations.table_edges_color)
        `);

        this.insertChessCustomizations = this.db.prepare(`
            INSERT INTO chess_customizations (
                id,
                chess_piece
            ) VALUES (
                @id,
                @chess_piece
            )
            ON CONFLICT(id) DO UPDATE SET
                chess_piece = COALESCE(excluded.chess_piece, chess_customizations.chess_piece)
        `);


        this.fetchPongCustomizations = this.db.prepare(`
            SELECT
                c.ball_color,
                c.left_paddle_color,
                c.right_paddle_color,
                c.table_edges_color
            FROM pong_customizations c
            where id = ?    
        `);

        this.fetchChessCustomizations = this.db.prepare(`
            SELECT
                c.chess_piece
            FROM chess_customizations c
            where id = ?    
        `);

        this.fetchMatchesByUser = this.db.prepare(`
            SELECT
                m.id AS match_id,
                m.winner_id,
                m.created_at,
                u1.id AS left_id, u1.username AS left_username, u1.avatar AS left_avatar, m.left_player_points AS left_points,
                u2.id AS right_id, u2.username AS right_username, u2.avatar AS right_avatar, m.right_player_points AS right_points
            FROM matches m
            JOIN users u1 ON m.left_player_id = u1.id
            JOIN users u2 ON m.right_player_id = u2.id
            WHERE m.left_player_id = ? OR m.right_player_id = ?
            ORDER BY m.created_at DESC
        `);
    }

    addMatch({ id, leftPlayer, rightPlayer, winner }) {

        this.insertUser.run(leftPlayer);

        this.insertUser.run(rightPlayer);

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
            createdAt: r.created_at,
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
