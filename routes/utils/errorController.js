const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass");

function dispatchErrorDevelopment(error, req, res) { // if we are in development mode, the error will be formatted to look like this.
  if (req.originalUrl.startsWith("/api")) { // if the reqs original url starts with api (it should)
    return res.status(error.statusCode).json({  // error status code will return whatever it is (500/400/404, etc)
      status: error.status, 
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
}
function dispatchErrorProduction(error, req, res) { // if we are in production mode, the error will be formatted to look like this.
  if (req.originalUrl.startsWith("/api")) { // if the reqs original url starts with api (it should)
    if (error.isOperational) { // if the error is operational = true,
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }

    return res.status(error.statusCode).json({ // if there is an error in production mode, we dont show the errors to the users. we just ask them to contact us.
      status: "Error",
      message:
        "Something went wrong Please contact support 123-999-8888 or email us at xxx@mail.com",
    });
  }
}

//Solution 1
function handleMongoDBDuplicate(err) { // if there is a duplication error (username, email)
  console.log(err); 
  let errorMessageDuplicateKey = Object.keys(err.keyValue)[0]; // the key that is returned in the mongodb err in that stupid line of text thats useless other than the key and value at the end. The first index key is returned
  let errorMessageDuplicateValue = Object.values(err.keyValue)[0]; // the value that is returned in the mongodb err in that stupid line of text thats useless other than the key and value at the end. The first index value is returned

  // console.log(errorMessageDuplicateKey);
  // console.log(errorMessageDuplicateValue);

  //we have parse some data in here
  let message = `${errorMessageDuplicateKey} - ${errorMessageDuplicateValue} is taken please choose another one`; // this is returning the value and key in a message to the user. 
  return new ErrorMessageHandlerClass(message, 400); // status here is 400, and the message is the variable from above.
}
//Solution 2
// function handleMongoDBDuplicate(err) {
//   //'E11000 duplicate key error collection: backend-api.users index: email_1 dup key: { email: "hamster@mail.com" }'
//   //' email: "hamster@mail.com" '
//   //' email  hamster@gmail.com '
//   //email hamster@gmail.com
//   //[email, hamster@gmail.com]

//   let errorMessage = err.message;

//   let findOpeningBracket = errorMessage.match(/{/).index;
//   let findClosingBracket = errorMessage.match(/}/).index;

//   let foundDuplicateValueString = errorMessage.slice(
//     findOpeningBracket + 1,
//     findClosingBracket
//   );

//   let newErrorString = foundDuplicateValueString.replace(/:|\"/g, "");
//   let trimmedNewErrorString = newErrorString.trim();

//   let errorStringArray = trimmedNewErrorString.split(" ");

//   let message = `${errorStringArray[0]} - ${errorStringArray[1]} is taken please choose another one`;
//   return new ErrorMessageHandlerClass(message, 400);
// }

module.exports = (err, req, res, next) => {// from app.js, err goes to this err in the params. err is the same as the next(e) in usercontroller.

  // console.log(err);
  // console.log(err.message);
  // console.log("2");
  err.statusCode = err.statusCode || 500; // if there is an err statuscode, display it. otherwise, return err 500.
  err.status = err.status || "error"; // if there is an err status, display it. otherwise, return an "err"

  // console.log("3");
  // console.log(err);
  let error = { ...err }; // we are spreading the error to make it bigger. 
  // console.log("4");

  error.message = err.message; // the message has to manually be extracted from err obj and applied to error obj b/c spread operator doesn't transfer the message

  // console.log("5");
  // console.log(error);
  // console.log(error.message);
  // console.log("6");
  //console.log(error);
  if (error.code === 11000 || error.code === 11001) { // if the err code (11000/11001) - the duplicate error statusCode, we are saying hey error, return the err msg in our function that we created.
    error = handleMongoDBDuplicate(error);
  }

  console.log("7");
  console.log(error); // display that error for us.
  if (process.env.NODE_ENV === "development") {  // once done w if statement, type function at the top of the page.   ***** 2d note. after our if statement above, if we are in development mode, we go to the function at the top.
    dispatchErrorDevelopment(error, req, res);
  } else {
    dispatchErrorProduction(error, req, res);
  }
};

//Mongoose and mongoDb have a lot of error codes. in error message, look at code to see what kind of err it is.