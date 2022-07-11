const AbstractError = require("./AbstractError");

class BadRequest extends AbstractError {

  constructor(message = 'BadRequest') {
    super(message, 'BadRequest', 1, 400);
  }
}


module.exports = BadRequest;