import { RequestHandler } from "express";
import { validationResult } from "express-validator";

/** Adds error handling for any invalid data. Responds with error code 400 if needed */
export const handleInvalid: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
};
