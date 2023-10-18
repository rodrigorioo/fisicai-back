import {Model} from "./Model";

export interface ProblemInterface {
    id: number,
    user_id: number,
    problem: string,
    created_at: string,
    updated_at: string,
}

export class ProblemModel extends Model {

    protected static table = "problems";

    constructor() {
        super();
    }
}
