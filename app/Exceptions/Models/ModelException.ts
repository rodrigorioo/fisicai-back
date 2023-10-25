export class ModelException extends Error {

    private readonly code: number;

    constructor(msg: string = "Excepción de modelo", code: number = 500) {
        super(msg);

        this.code = code;
    }

    getCode(): number {
        return this.code;
    }
}
