import { body, validationResult } from "express-validator";

export const validateSupplier = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Supplier name is required.")
    .isLength({ min: 2 })
    .withMessage("Supplier name must be at least 2 characters long."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Supplier email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("phone").optional({ checkFalsy: true }).trim(),

  body("notes").optional({ checkFalsy: true }).trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMap = {};
      errors.array().forEach((err) => {
        if (!errorMap[err.path]) {
          errorMap[err.path] = err.msg;
        }
      });
      return res.status(400).json({
        message: "Validation failed.",
        errors: errorMap,
      });
    }
    next();
  },
];
