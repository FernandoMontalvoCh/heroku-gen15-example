const { body, validationResult } = require("express-validator");

//Utils
const { AppError } = require("../utils/appError.util");

const checkValidations = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    // [{..., msg}] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = error.array().map((err) => err.msg);

    const message = errorMessages.join(". ");

    return next(new AppError(message, 400))
  }
  next();
};

const createUserValidators = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Name must be al least 2 characters"),
  body("email").isEmail().withMessage("Must provid a valid email"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  checkValidations,
];

const createPostValidators = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("content")
    .isString()
    .withMessage("Content must be a string")
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Content must be at least 3 characters"),
  checkValidations,
];

module.exports = { createUserValidators, createPostValidators };
