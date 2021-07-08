const {
  checkIsEmail,
  checkIsAlpha,
  checkIsAlphanumeric,
} = require("../../utils/authMethods");
// we take in our authmethods.js 

function checkIsEmailFunc(req, res, next) {
  const { errorObj } = res.locals; 

  if (!checkIsEmail(req.body.email)) {
    errorObj.wrongEmailFormat = "Must be in email format!"; 
  } // this checks our email input box. If it doesnt match the email format, then it will return err. 

  next(); // if no err, keep going. 
}

function checkIsAlphaFunc(req, res, next) {
  const { errorObj } = res.locals;
  const inComingData = req.body;
  for (key in inComingData) {
    if (key === "firstName" || key === "lastName") {
      if (!checkIsAlpha(inComingData[key])) {
        errorObj[`${key}`] = `${key} can only have characters`;
      }
    }
  } // this checks our first name and last name input box. If it doesnt match the  format, then it will return err. 

  next(); // if no err, keep going. 
}

function checkIsAlphanumericFunc(req, res, next) {
  const { errorObj } = res.locals;
  if (!checkIsAlphanumeric(req.body.username)) {
    errorObj.usernameError = "username can only have characters and numbers";
  }  // this checks our username input box. If it doesnt match the username format, then it will return err. 

  next(); // if no err, keep going. 
}

module.exports = {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
};
