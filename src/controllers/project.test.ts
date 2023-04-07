import crypto from "crypto";
import fs from "fs";
import { v4 } from "uuid";
import { CORE_ROOT } from "../config";
import { CoreUUID } from "../types/brand.types";
import { Core } from "../types/global.types";
import { saveCore } from "./project.controller";

test("saveCore", () => {
    const mockCore: Core = createMockCore();

    const hashSum = crypto.createHash("md5");
    hashSum.update(mockCore.contents);

    saveCore(mockCore);

    const corePath: string = CORE_ROOT + "/" + mockCore.coreid + ".js";

    const savedFileContent = fs.readFileSync(corePath);

    const newHashSum = crypto.createHash("md5");
    newHashSum.update(savedFileContent);

    expect(hashSum.digest("hex")).toBe(newHashSum.digest("hex"));
    fs.rmSync(corePath);
});

function createMockCore(): Core {
    const mockCore = {
        coreid: v4() as CoreUUID,
        contents: Buffer.from("function mockCore() { return (1 + 1); }")
    };
    return mockCore;
}
