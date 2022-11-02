import { Movie, Operator } from "./types"

function onlyUnique(
    value: { operator: Operator },
    index: number,
    self: { operator: Operator }[]
) {
    return self.findIndex((item) => item.operator === value.operator) === index
}

export class MovieStorage {
    movies: { [key: string]: Movie } = {}
    mappings: { [key: string]: string } = {}
    constructor() {}

    find(operator: Operator, id: string | number): Movie | undefined {
        return this.movies[this.mappings[`${operator}:${id}`]]
    }

    set(movie: Movie) {
        const tmdbId = `${movie.tmdbId}`
        let newMovie = movie
        const found = this.movies[`tmdb:${tmdbId}`]
        if (found) {
            const existing = found
            const operatorIds = existing.operatorIds
                .concat(movie.operatorIds)
                .filter(onlyUnique)
            const operatorUrls = existing.operatorUrls
                .concat(movie.operatorUrls)
                .filter(onlyUnique)
            newMovie = { ...existing, operatorIds, operatorUrls }
        }

        this.movies[`tmdb:${tmdbId}`] = newMovie
        movie.operatorIds.forEach((id) => {
            this.mappings[`${id.operator}:${id.id}`] = `tmdb:${movie.tmdbId}`
        })
    }
}
