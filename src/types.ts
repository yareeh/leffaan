interface LocalizedString {
    lang: "fi"
    value: string
}

type Operator = "Finnkino" | "Kinot"

export interface Movie {
    originalTitle?: string
    localTitles: LocalizedString[]
    year?: number
    runningTime?: number
    operatorUrls: [{ operator: Operator; url: string }]
    operatorIds: [{ operator: Operator; id: string | number }]
}

export interface Show {
    operatorId: string | number
    movie: Movie
    operator: Operator
    startTime: Date
    locationId?: string | number
    theatre: string
    screen?: string
    showDetails?: string
    url: string
}
