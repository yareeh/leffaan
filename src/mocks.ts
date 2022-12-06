import { readFileSync } from "fs"
import { bioRexJsonToShows } from "./bio-rex"

export const mockKinot = async () => {
    return JSON.parse(readFileSync("./test-data/kinot.fi.json").toString())
}

export const mockFinnkino = async () => {
    return readFileSync("./test-data/schedule.xml").toString()
}

export const mockBioRex = async () => {
    return bioRexJsonToShows(
        JSON.parse(readFileSync("./test-data/bio-rex.json").toString())
    )
}

export const mockMatchMovie = async () => {
    return 1398
}

export const mockDate = () => {
    return new Date("2022-02-27T16:30:00.000Z")
}
