import { body, validationResult } from "express-validator";

export const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters long."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number."),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer."),

  body("supplierId")
    .notEmpty()
    .withMessage("Supplier is required.")
    .isInt()
    .withMessage("Supplier ID must be a valid integer."),

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
