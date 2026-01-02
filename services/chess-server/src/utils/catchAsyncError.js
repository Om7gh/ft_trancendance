const catchAsyncError = (fn) => {
  return async function (...args) {
    try {
      // preserve `this` and return value for both controllers and repositories
      return await fn.apply(this, args);
    } catch (e) {
      throw e;
    }
  };
};

module.exports = { catchAsyncError };
