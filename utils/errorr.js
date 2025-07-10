// ./utils/expressError.js
class errorr extends Error {
  constructor(status = 500, message = "Something went wrong") {
    super(message); // this is important!
    this.status = status;
  }
}

module.exports = errorr;
