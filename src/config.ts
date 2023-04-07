import { config as dotenvConfig } from "dotenv";
import path from "path";

dotenvConfig();

export const DEFAULT_MODE = "debug";
export const DEFAULT_PORT = 3000;
export const DEFAULT_CORE_ROOT = "./data/cores";
export const DEAULT_PROJECT_DB_PATH = "./data/project.json";

export const MODE = process.env.MODE || DEFAULT_MODE;
export const PORT = process.env.PORT || DEFAULT_PORT;

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
    PROJECT_DB_PATH
};
