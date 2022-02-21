/* eslint-disable no-underscore-dangle */
import { xml2js } from "xml-js"
import * as z from "zod"

const TextNode = z.object({ _text: z.string() }).transform((node) => node._text)
const NumberNode = z
    .object({ _text: z.number() })
    .transform((node) => node._text)
const DateNode = z
    .object({ _text: z.string().transform((s) => new Date(s)) })
    .transform((node) => node._text)

const FinnkinoShow = z.object({
    ID: NumberNode,
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

export function toShow() {}
