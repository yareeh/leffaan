import { format } from "date-fns-tz"
import React, { useCallback, useEffect, useState } from "react"
import "./App.css"
import { finnkinoShowToShow, parseFinnkino } from "./finnkino"
import { kinotShowToShow, parseKinotJson } from "./kinot-fi"
import { Show } from "./types"

async function getKinotShows(): Promise<Show[]> {
    const response = await fetch(
        "https://www.kinot.fi/wp-json/kinot-shows/v1/shows?limit=3&offset=0&theater=all&date=all"
    )
    const kinotResponse = await response.json()
    const kinotResult = parseKinotJson(kinotResponse)
    return kinotResult.map(kinotShowToShow)
}

async function getFinnkinoShows(): Promise<Show[]> {
    const response = await fetch(
        "https://www.finnkino.fi/xml/Schedule?area=1002"
    )
    const finnkinoXml = await response.text()
    const finnkinoShows = parseFinnkino(finnkinoXml)
    return finnkinoShows.map(finnkinoShowToShow)
}

function App() {
    const [shows, showsSet] = useState<Show[]>([])

    const getShows = useCallback(async () => {
        const kinotShows = await getKinotShows()
        const finnkinoShows = await getFinnkinoShows()
        const allShows = [...kinotShows, ...finnkinoShows].sort(
            (s1, s2) => s1.startTime.getTime() - s2.startTime.getTime()
        )
        showsSet(allShows)
    }, [])

    useEffect(() => {
        getShows()
    }, [getShows])

    return (
        <div className="App">
            <div>
                <h1>Shows</h1>
                {shows.map((s) => (
                    <div key={`${s.operator}-${s.operatorId}`}>
                        <div className="show__title">
                            {s.movie.localTitles[0].value}
                        </div>
                        <div className="show__startDateTime">
                            {format(s.startTime, "d.M.yyyy H:mm", {
                                timeZone: "Europe/Helsinki",
                            })}
                        </div>
                        <div className="show__theatre">{s.theatre}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
