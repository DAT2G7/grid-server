import { config as dotenvConfig } from "dotenv";
import path from "path";

dotenvConfig();

export const DEFAULT_MODE = "debug";
export const DEFAULT_PORT = 3000;
export const DEFAULT_HTTPS_PORT = 3443;
export const DEFAULT_CORE_ROOT = "./data/cores";
export const DEAULT_PROJECT_DB_PATH = "./data/project.json";
export const DEFAULT_SSL_KEY_PATH = "./sslcert/origin-cert-key.pem";
export const DEFAULT_SSL_CERT_PATH = "./sslcert/origin-cert.pem";

export const MODE = process.env.MODE || DEFAULT_MODE;
export const PORT = process.env.PORT || DEFAULT_PORT;
export const HTTPS_PORT = process.env.HTTPS_PORT || DEFAULT_HTTPS_PORT;

export const SSL_KEY_PATH = process.env.SSL_KEY_PATH || DEFAULT_SSL_KEY_PATH;
export const SSL_CERT_PATH = process.env.SSL_CERT_PATH || DEFAULT_SSL_CERT_PATH;

export const CORE_ROOT = path.resolve(
    process.cwd(),
    process.env.CORE_ROOT || DEFAULT_CORE_ROOT
);

export const PROJECT_DB_PATH = path.resolve(
    process.cwd(),
    process.env.PROJECT_DB_PATH || DEAULT_PROJECT_DB_PATH
);

export default {
    MODE,
    PORT,
    CORE_ROOT,
    PROJECT_DB_PATH,
    SSL_CERT_PATH,
    SSL_KEY_PATH,
    HTTPS_PORT
};
