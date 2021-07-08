const {
  isEmpty,
  isStrongPassword,
  isEmail,
  isAlpha,
  isAlphanumeric,
} = require("validator");

const checkIsEmpty = (target) => (isEmpty(target) ? true : false);

const checkIsStrongPassword = (password) =>
  isStrongPassword(password) ? true : false;

const checkIsEmail = (email) => (isEmail(email) ? true : false);

const checkIsAlpha = (target) => (isAlpha(target) ? true : false);

const checkIsAlphanumeric = (target) => (isAlphanumeric(target) ? true : false);

module.exports = {
  checkIsEmpty,
  checkIsStrongPassword,
  checkIsEmail,
  checkIsAlpha,
  checkIsAlphanumeric,
};

// this page just handles our extra validator functions. This is to help us with our controller and not have it too bunched up with code.
