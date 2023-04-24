import { param } from "express-validator";

// No reason to export this as validateUUIDs handles the single case
const validateUUID = (name: string) =>
    param(name)
        .exists()
        .isUUID()
        .withMessage(name + " is not a valid UUID");

/** Ensures the given names exist as url parameters and are valid UUIDs */
export const validateUUIDs = (...names: string[]) => names.map(validateUUID);
