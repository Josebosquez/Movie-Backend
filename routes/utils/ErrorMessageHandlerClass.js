class ErrorMessageHandlerClass extends Error {
  // extends ... an obj in this case an error obj. this Error obj is built in to node
  constructor(message, statusCode) {
    super(message, statusCode);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    console.log(this);
  }
}

module.exports = ErrorMessageHandlerClass;

// this preps our error object for good looking error objects not shit err msgs we dont use or cant read