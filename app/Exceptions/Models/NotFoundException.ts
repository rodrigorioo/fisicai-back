import {ModelException} from "./ModelException";

export class NotFoundException extends ModelException {
    constructor(msg: string = "Model not founded") {
        super(msg, 404);
    }
}
