export class TopicNotFound extends Error {

    private readonly code: number;

    constructor(msg: string = "Tema no encontrado", code: number = 404) {
        super(msg);

        this.code = code;
    }

    getCode(): number {
        return this.code;
    }
}
