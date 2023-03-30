import { config as dotenvConfig } from "dotenv";
import { homedir } from "os";
dotenvConfig();

export const DEFAULT_MODE = "debug";
export const DEFAULT_PORT = 3000;
export const DEFAULT_CORE_ROOT = homedir() + "/grid-server/cores";
export const DEFAULT_PROJECTS_JSON_PATH = "/database/project.json";

export const MODE = process.env.MODE || DEFAULT_MODE;
export const PORT = process.env.PORT || DEFAULT_PORT;
export const CORE_ROOT = process.env.CORE_ROOT || DEFAULT_CORE_ROOT;
export const PROJECTS_JSON_PATH =
    process.env.PROJECTs_JSON_PATH || DEFAULT_PROJECTS_JSON_PATH;

export default {
    MODE,
    PORT,
    CORE_ROOT,
    PROJECTS_JSON_PATH
};
