const catchAsyncError = (fn) => {
  return async function (...args) {
    try {
      return await fn.apply(this, args);
    } catch (e) {
      throw e;
    }
  };
};

module.exports = { catchAsyncError };
