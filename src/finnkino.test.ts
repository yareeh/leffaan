import { readFileSync } from "fs";
import { parseFinnkino } from "./finnkino";

describe("finnkino", () => {
    it("can parse test xml", () => {
        parseFinnkino(readFileSync("./test-data/schedule.xml").toString());
    });
});
