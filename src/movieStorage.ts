import { Movie, Operator } from "./types"

function onlyUnique(value: any, index: number, self: any[]) {
    return self.indexOf(value) === index
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
        if (this.movies[tmdbId]) {
            const existing = this.movies[tmdbId]
            const operatorIds = existing.operatorIds
                .concat(movie.operatorIds)
                .filter(onlyUnique)
            const operatorUrls = existing.operatorUrls
                .concat(movie.operatorUrls)
                .filter(onlyUnique)
            newMovie = { ...existing, operatorIds, operatorUrls }
        }

        this.movies[tmdbId] = newMovie
        movie.operatorIds.forEach((id) => {
            this.mappings[`${id.operator}:${id.id}`] = `${movie.tmdbId}`
        })
    }
}
