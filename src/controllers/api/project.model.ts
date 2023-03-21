import { randomUUID } from "crypto";
import { UUID } from "../../types/brand.types";
import { writeFileSync } from "fs";
import { homedir } from "os";

export function saveCore(coreContents: string): UUID {
    const newUUID: string = randomUUID();

    const corePath: string = homedir() + "/cores/" + newUUID + ".js";

    try {
        writeFileSync(corePath, coreContents);
    } catch {
        // TODO: Handle file write error.
    }

    return newUUID as UUID;
}

export function checkCore(coreContents: string): boolean {
    // Function for furure testing of contests, before acceptance of core.
    return true;
}
