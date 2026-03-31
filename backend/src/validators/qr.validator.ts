import { body } from "express-validator";

export const qrValidator = [
  body("url")
    .trim()
    .notEmpty()
    .withMessage("URL is required")
    .isURL({ require_protocol: true })
    .withMessage("Must be a valid URL with http or https"),
  body("size")
    .optional()
    .matches(/^\d+x\d+$/)
    .withMessage("Size must be like 300x300"),
  body("color")
    .optional()
    .isHexColor()
    .withMessage("Color must be hex"),
  body("bgcolor")
    .optional()
    .isHexColor()
    .withMessage("Background color must be hex"),
];