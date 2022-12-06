import { expect } from "chai"
import { readFileSync } from "fs"
import { bioRexJsonToShows } from "../src/bio-rex"

describe("Bio Rex", () => {
    it("can convert html to shows", () => {
        const json = JSON.parse(
            readFileSync("./test-data/bio-rex.json").toString()
        )

        const shows = bioRexJsonToShows(json)
        const firstShow = shows[0]
        expect(firstShow.startTime.toISOString()).equal(
            "2022-02-27T10:15:00.000Z"
        )
        expect(firstShow.title).to.equal("Violent Night")
        expect(firstShow.theatre).to.equal("BioRex Redi")
        expect(firstShow.screen).to.equal("Sali 1")
        expect(firstShow.url).to.equal(
            "https://biorex.fi/elokuvat/violent-night/?f_cinemas=all"
        )
        expect(firstShow.operator).to.equal("BioRex")
        expect(firstShow.operatorId).to.equal(
            "https://biorex.fi/elokuvat/violent-night/"
        )
    })
})
