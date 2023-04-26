import fs from "fs";
import { getSSLCredentials } from "./helpers";

jest.mock("fs");

describe("getSSLCredentials", () => {
    beforeAll(() => {
        jest.resetModules();
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue("test");
    });

    it("should call fs.existsSync", () => {
        getSSLCredentials();
        expect(fs.existsSync).toHaveBeenCalled();
    });

    it("should call fs.readFileSync", () => {
        getSSLCredentials();
        expect(fs.readFileSync).toHaveBeenCalled();
    });

    it("should return an object with key and cert", () => {
        expect(getSSLCredentials()).toEqual({
            key: "test",
            cert: "test"
        });
    });

    it("should return undefined if either file does not exist", () => {
        (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
        expect(getSSLCredentials()).toBeUndefined();
    });
});
