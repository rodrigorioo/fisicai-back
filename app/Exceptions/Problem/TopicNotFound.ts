export class TopicNotFound extends Error {

    private readonly code: number;

    constructor(msg: string = "No se pudo encontrar a que tema corresponde el problema, asegúrese de escribirlo correctamente", code: number = 404) {
        super(msg);

        this.code = code;
    }

    getCode(): number {
        return this.code;
    }
}
