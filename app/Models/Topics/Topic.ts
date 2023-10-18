

interface MRUOperations {
    distancia : string,
    velocidad : string,
    tiempo : string,
    posicion_inicial : string,
    hora : string,
    rapidez : string,
}

interface MRUVOperations {
    velocidad_inicial : string,
    velocidad_final : string,
    tiempo_inicial : string,
    tiempo_final : string,
    posicion_final : string,
    posicion : string,
    aceleracion: string,
}

interface Operations extends MRUOperations, MRUVOperations {}

// TODO: Topic class

export { Operations, MRUOperations, MRUVOperations }
