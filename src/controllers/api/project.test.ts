import crypto from "crypto";
import fs from "fs";
import { homedir } from "os";
import { UUID } from "../../types/brand.types";
import { saveCore } from "../project.controller";
import { checkCore } from "./project.model";

test("saveCore", () => {
    const mockCoreJS = "function mockCore() { return (1 + 1); }";

    const hashSum = crypto.createHash("md5");
    hashSum.update(mockCoreJS[0]);

    const coreID: UUID = saveCore(Buffer.from(mockCoreJS));

    const corePath: string = homedir() + "/cores/" + coreID + ".js";

    const savedFileContent = fs.readFileSync(corePath);

    const newHashSum = crypto.createHash("md5");
    newHashSum.update(savedFileContent);

    expect(hashSum).toBe(newHashSum);
});

test("checkCore", () => {
    const mockCoreJS =
        "function mockCore(x) { return (x + 1); } \n mockCore(1);";

    const expectedResult = true;
    const actualResult = checkCore(Buffer.from(mockCoreJS));

    expect(actualResult).toBe(expectedResult);
});
