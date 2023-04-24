import { param } from "express-validator";

const validateWholeNumber = (input: string) =>
    param(input)
        .exists()
        .isInt()
        .withMessage(input + " is not a valid Integer");

export const validateWholeNumbers = (...names: string[]) =>
    names.map(validateWholeNumber);
