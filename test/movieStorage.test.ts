import { expect } from "chai"
import { MovieStorage } from "../src/movieStorage"
import { Movie } from "../src/types"

const finnkinoMovie: Movie = {
    localTitles: [],
    operatorUrls: [{ operator: "Finnkino", url: "finnkino url 123" }],
    operatorIds: [{ operator: "Finnkino", id: 123 }],
    tmdbId: 4321,
}
const kinotMovie: Movie = {
    localTitles: [],
    operatorUrls: [{ operator: "Kinot", url: "kinot url 543" }],
    operatorIds: [{ operator: "Kinot", id: 543 }],
    tmdbId: 4321,
}
const mergedMovie: Movie = {
    localTitles: [],
    operatorUrls: finnkinoMovie.operatorUrls.concat(kinotMovie.operatorUrls),
    operatorIds: finnkinoMovie.operatorIds.concat(kinotMovie.operatorIds),
    tmdbId: 4321,
}

describe("MovieStorage", () => {
    it("does not find movie not in db", () => {
        const storage = new MovieStorage()
        expect(storage.find("Finnkino", 123)).to.be.undefined
    })
    it("finds stored movie", () => {
        const storage = new MovieStorage()
        storage.set(finnkinoMovie)
        expect(storage.find("Finnkino", 123)).to.deep.equal(finnkinoMovie)
    })
    it("adds operator id and url to movie", () => {
        const storage = new MovieStorage()
        storage.set(finnkinoMovie)
        storage.set(kinotMovie)
        expect(storage.find("Finnkino", 123)).to.deep.equal(mergedMovie)
        expect(storage.find("Kinot", 543)).to.deep.equal(mergedMovie)
    })
})
