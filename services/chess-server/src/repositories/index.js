const getPieceStyle = (db, username) => {
  return db
    .prepare(
      `
            SELECT pieces FROM players WHERE username = ?
        `
    )
    .get(username);
};

module.exports = { getPieceStyle };
