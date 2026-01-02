const app = require('../index');
const { getPieceStyle } = require('../repositories');
const { catchAsyncError } = require('../utils/catchAsyncError');

const pieceCustomization = catchAsyncError(async (req, rep) => {
  const { username } = req.params;
  const piece = getPieceStyle(app.db, username);
});

module.exports = { pieceCustomization };
