import dotenv from "dotenv"
import type { NextApiRequest, NextApiResponse } from "next"
import { bioRexJsonToShows, fetchBioRexJson } from "../../src/bio-rex"
import { finnkinoShowToShow, parseFinnkino } from "../../src/finnkino"
import { kinotShowToShow, parseKinotJson } from "../../src/kinot-fi"
import {
    mockBioRex,
    mockDate,
    mockFinnkino,
    mockKinot,
    mockMatchMovie,
} from "../../src/mocks"
import { MovieStorage } from "../../src/movieStorage"
import { searchTitle } from "../../src/tmdb"
import { Operator, Show } from "../../src/types"

dotenv.config()
const TestMode = process.env.LEFFAAN_MODE === "test"
const apiKey = process.env.TMDB_API_KEY
if (!TestMode && !apiKey) throw new Error("No TMDB_API_KEY")

const movies = new MovieStorage()

let matchMovie = async (
    title: string,
    operator: Operator,
    id: string | number,
    year?: number
): Promise<number> => {
    const fromStorage = movies.find(operator, id)
    if (fromStorage !== undefined) {
        return fromStorage.tmdbId
    }
    const fromTmdb = await searchTitle(
        title,
        apiKey,
        year ? year : timeSource().getFullYear()
    )
    if (fromTmdb.length > 1) {
        for (const movie of fromTmdb) {
            if (movie.original_title === title) return movie.id
        }
    }
    return fromTmdb[0]?.id
}

let getKinot = async () => {
    const response = await fetch(
        "https://www.kinot.fi/wp-json/kinot-shows/v1/shows?limit=3&offset=0&theater=all&date=all"
    )
    return response.json()
}
let getFinnkino = async () => {
    const response = await fetch(
        "https://www.finnkino.fi/xml/Schedule?area=1002"
    )
    return response.text()
}

let getBioRex = async () => {
    return await getBioRexShows()
}

let timeSource = () => new Date()

if (TestMode) {
    getKinot = mockKinot
    getFinnkino = mockFinnkino
    getBioRex = mockBioRex
    matchMovie = mockMatchMovie
    timeSource = mockDate
    console.log("Running in test mode")
}

async function getBioRexShows(): Promise<Show[]> {
    const bioRexJson = await fetchBioRexJson()
    const rexShows = bioRexJsonToShows(bioRexJson)
    const rexMapped: Show[] = []
    for (const show of rexShows) {
        const tmdbId = await matchMovie(show.title, "BioRex", show.operatorId)
        if (tmdbId !== undefined) {
            movies.set({
                tmdbId,
                localTitles: [{ lang: "fi", value: show.title }],
                operatorUrls: [
                    { operator: "BioRex", url: show.operatorId.toString() },
                ],
                operatorIds: [{ operator: "BioRex", id: show.operatorId }],
            })
            rexMapped.push({ ...show, tmdbId })
        }
    }
    return rexMapped
}

async function getKinotShows(): Promise<Show[]> {
    const kinotResponse = await getKinot()
    const kinotResult = parseKinotJson(kinotResponse)
    const kinotMapped = []
    for (const show of kinotResult) {
        const tmdbId = await matchMovie(
            show.movie_title,
            "Kinot",
            show.movie_id
        )
        if (tmdbId !== undefined) {
            movies.set({
                tmdbId,
                localTitles: [{ lang: "fi", value: show.movie_title }],
                operatorUrls: [{ operator: "Kinot", url: show.link }],
                operatorIds: [{ operator: "Kinot", id: show.movie_id }],
            })
            kinotMapped.push({ show, tmdbId })
        }
    }
    return kinotMapped.map((s) => kinotShowToShow(s.show, s.tmdbId))
}

async function getFinnkinoShows(): Promise<Show[]> {
    const finnkinoXml = await getFinnkino()
    const finnkinoShows = parseFinnkino(finnkinoXml)
    const finnkinoMapped = []
    for (const show of finnkinoShows) {
        const tmdbId = await matchMovie(
            show.OriginalTitle,
            "Finnkino",
            show.EventID,
            show.ProductionYear
        )
        if (tmdbId !== undefined) {
            movies.set({
                tmdbId,
                operatorIds: [{ operator: "Finnkino", id: show.EventID }],
                localTitles: [{ lang: "fi", value: show.Title }],
                operatorUrls: [{ operator: "Finnkino", url: show.EventURL }],
                originalTitle: show.OriginalTitle,
                runningTime: show.LengthInMinutes,
                year: show.ProductionYear,
            })
            finnkinoMapped.push({ show, tmdbId })
        }
    }
    return finnkinoMapped.map((s) => finnkinoShowToShow(s.show, s.tmdbId))
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Show[]>
) {
    const kinotShows = await getKinotShows()
    const finnkinoShows = await getFinnkinoShows()
    const rexShows = await getBioRex()
    const now = timeSource().getTime()
    const allShows = [...kinotShows, ...finnkinoShows, ...rexShows]
        .filter((s) => s.startTime.getTime() >= now)
        .sort((s1, s2) => s1.startTime.getTime() - s2.startTime.getTime())

    res.status(200).json(allShows)
}
