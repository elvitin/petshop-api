const AbstractError = require("./AbstractError");

class NotFound extends AbstractError {

  constructor(message = 'NotFound') {
    super(message, 'NotFound', 2, 404);
  }
}


module.exports = NotFound;