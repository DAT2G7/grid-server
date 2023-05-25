import fs from "fs";
import { SSL_CERT_PATH, SSL_KEY_PATH } from "../config";

/**
 * Responsible for retrieving the SSL credentials from the file system.
 * @returns An object containing the key and cert, or undefined if the files do not exist.
 */
export function getSSLCredentials(): { key: Buffer; cert: Buffer } | undefined {
    if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
        return {
            key: fs.readFileSync(SSL_KEY_PATH),
            cert: fs.readFileSync(SSL_CERT_PATH)
        };
    }
    return undefined;
}

/**
 * Checks if a value is defined, i.e. not null or undefined.
 * @param value The value to check.
 * @returns {boolean} true if the value is defined, false if not.
 */
export function isDefined<T>(value: T | undefined | null): value is T {
    return value != null;
}
