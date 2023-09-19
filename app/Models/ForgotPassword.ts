import {Model} from "./Model";

export interface ForgotPasswordInterface {
    id: number,
    email: string,
    code: string,
    created_at: string,
    updated_at: string,
}

export class ForgotPassword extends Model {

    protected static table = "forgot_passwords";

    constructor() {
        super();
    }
}
