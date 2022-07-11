class AbstractError extends Error {
  constructor(errorMsg, errorName, idError, statusCode) {
    super(errorMsg);
    this.name = errorName;
    this.idError = idError;
    this.statusCode = statusCode;
  }
}

module.exports = AbstractError;
