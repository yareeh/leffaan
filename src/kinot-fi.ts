import { zonedTimeToUtc } from "date-fns-tz"
import parse from "date-fns/parse"
import { decode } from "html-entities"
import * as z from "zod"
import { Show } from "./types"

const KinotShow = z.object({
    id: z.number(),
    datetime: z
        .string()
        .transform((datetime) =>
            zonedTimeToUtc(
                parse(datetime, "dd.MM.yyyy HH:mm", new Date()),
                "Europe/Helsinki"
            )
        ),
    theater_title: z.string(),
    movie_id: z.number(),
    movie_title: z.string().transform((title) => decode(title)),
    link: z.string(),
})
type KinotShow = z.infer<typeof KinotShow>

export function parseKinotJson(json: any): KinotShow[] {
    const shows: KinotShow[] = z.array(KinotShow).parse(json)
    return shows
}
export function kinotShowToShow(show: KinotShow, tmdbId?: number): Show {
    return {
        operatorId: show.id,
        title: show.movie_title,
        tmdbId,
        // movie: {
        //     localTitles: [{ lang: "fi", value: show.movie_title }],
        //     operatorUrls: [{ operator: "Kinot", url: show.link }],
        //     operatorIds: [{ operator: "Kinot", id: show.movie_id }],
        // },
        operator: "Kinot",
        startTime: show.datetime,
        theatre: show.theater_title,
        url: show.link,
    }
}
