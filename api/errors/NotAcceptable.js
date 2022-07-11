const AbstractError = require("./AbstractError");

class NotAcceptable extends AbstractError {

  constructor(errorMsg = 'NotAcceptable') {
    super(errorMsg, 'NotAcceptable', 3, 406);
  }
}


module.exports = NotAcceptable;