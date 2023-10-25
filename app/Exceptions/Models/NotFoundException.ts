import {ModelException} from "./ModelException";

export class NotFoundException extends ModelException {
    constructor(msg: string = "Modelo no encontrado") {
        super(msg, 404);
    }
}
