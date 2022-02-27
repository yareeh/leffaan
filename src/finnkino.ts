/* eslint-disable no-underscore-dangle */
import { xml2js } from "xml-js"
import * as z from "zod"
import { Show } from "./types"

const TextNode = z.object({ _text: z.string() }).transform((node) => node._text)
const NumberNode = z
    .object({ _text: z.number() })
    .transform((node) => node._text)
const DateNode = z
    .object({ _text: z.string().transform((s) => new Date(s)) })
    .transform((node) => node._text)

const FinnkinoShow = z.object({
    ID: NumberNode,
    EventID: NumberNode,
    dttmShowStartUTC: DateNode,
    Title: TextNode,
    OriginalTitle: TextNode,
    ProductionYear: NumberNode,
    LengthInMinutes: NumberNode,
    TheatreID: NumberNode,
    TheatreAuditriumID: NumberNode, // sic.
    Theatre: TextNode,
    TheatreAuditorium: TextNode,
    PresentationMethodAndLanguage: TextNode,
    ShowURL: TextNode,
    EventURL: TextNode,
})

type FinnkinoShow = z.infer<typeof FinnkinoShow>

export function parseFinnkino(xml: string): FinnkinoShow[] {
    const parsedXml = xml2js(xml, {
        compact: true,
        nativeType: true,
        trim: true,
        ignoreAttributes: true,
        ignoreDeclaration: true,
        ignoreDoctype: true,
    }) as { Schedule: { Shows: { Show: any[] } } }

    const shows = z.array(FinnkinoShow).parse(parsedXml.Schedule.Shows.Show)
    return shows
}

export const toShow = (show: FinnkinoShow): Show => ({
    operator: "Finnkino",
    locationId: show.TheatreID,
    startTime: show.dttmShowStartUTC,
    movie: {
        operatorIds: [{ operator: "Finnkino", id: show.EventID }],
        localTitles: [{ lang: "fi", value: show.Title }],
        operatorUrls: [{ operator: "Finnkino", url: show.EventURL }],
        originalTitle: show.OriginalTitle,
        runningTime: show.LengthInMinutes,
        year: show.ProductionYear,
    },
    screen: show.TheatreAuditorium,
    showDetails: show.PresentationMethodAndLanguage,
    theatre: show.Theatre,
    url: show.ShowURL,
})
