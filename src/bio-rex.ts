import { parse } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import jsdom from "jsdom"
import fetch from "node-fetch"
import { z } from "zod"
import { Operator, Show } from "./types"

const BioRexJson = z.object({ posts: z.string() })

const operator: Operator = "BioRex"

const url = "https://biorex.fi/wp-admin/admin-ajax.php?lang=fi&f_cinemas=all"
const headers = {
    cookie: "PHPSESSID=asdf; location=14; pll_language=fi",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
}

const formParameters: { [key: string]: string } = {
    action: "br_movies_handler",
    genre: "-1",
    date: "-1",
    format: "-1",
    language: "-1",
    activeAlternativeTheater: "all",
    activeAlternativeTheaterTitle: "Helsinki+kaikki",
}

const formBodyElements = []
for (const property in formParameters) {
    const encodedKey = encodeURIComponent(property)
    const encodedValue = encodeURIComponent(formParameters[property])
    formBodyElements.push(encodedKey + "=" + encodedValue)
}
const formBody = formBodyElements.join("&")

export async function fetchBioRexJson() {
    const result = await fetch(url, {
        method: "POST",
        headers,
        body: formBody,
    })
    return result.json()
}

export function bioRexJsonToShows(json: any): Show[] {
    const html = BioRexJson.parse(json).posts
    const dom = new jsdom.JSDOM(html).window.document.body
    const result: Show[] = []

    const movies = dom.querySelectorAll(".movie-card")
    movies.forEach((m) => {
        const title = m
            .querySelector(".movie-carousel__title")
            ?.innerHTML.trim()!
        const operatorId = m.querySelector("a")?.getAttribute("href")!
        const shows = m.querySelectorAll(".btn-showtime-test")
        shows.forEach((s) => {
            const venue = s
                .querySelector(".movie-carousel__showtime-cinema")
                ?.innerHTML.trim()!
            const theatre = `BioRex ${venue.replaceAll(/[()]/g, "")}`
            const screen = s
                .querySelector(".movie-carousel__showtime-screen")
                ?.firstChild?.nodeValue?.trim()
            const startTimeString = s
                .querySelector(
                    ".all-movies__showtimes__locationtime span.pr-1:not(.movie-carousel__showtime-screen)"
                )
                ?.innerHTML.trim()
                .replace(/^\S*\s/, "")!
            const startTime = zonedTimeToUtc(
                parse(startTimeString, "dd.MM. HH:mm", new Date()),
                "Europe/Helsinki"
            )

            const url = `${operatorId}?f_cinemas=all`
            const show: Show = {
                operator,
                operatorId,
                startTime,
                theatre,
                title,
                url,
                screen,
            }
            result.push(show)
        })
    })
    return result
}
