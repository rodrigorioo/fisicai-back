import {Model} from "./Model";

export interface UserInterface {
    id: number,
    email: string,
    password: string,
    created_at: string,
    updated_at: string,
}

export class UserModel extends Model {

    protected static table = "users";

    constructor() {
        super();
    }
}
