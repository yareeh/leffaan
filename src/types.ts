interface LocalizedString {
    lang: "fi"
    value: string
}

export type Operator = "Finnkino" | "Kinot"

export interface Movie {
    originalTitle?: string
    localTitles: LocalizedString[]
    year?: number
    runningTime?: number
    operatorUrls: { operator: Operator; url: string }[]
    operatorIds: { operator: Operator; id: string | number }[]
    tmdbId: number
}

export interface Show {
    operatorId: string | number
    tmdbId?: number
    title: string
    operator: Operator
    startTime: Date
    locationId?: string | number
    theatre: string
    screen?: string
    showDetails?: string
    url: string
}
