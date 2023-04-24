import fs from "fs";
import { SSL_CERT_PATH, SSL_KEY_PATH } from "../config";

export function getSSLCredentials() {
    if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
        return {
            key: fs.readFileSync(SSL_KEY_PATH),
            cert: fs.readFileSync(SSL_CERT_PATH)
        };
    }
    return undefined;
}
