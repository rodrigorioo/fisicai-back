import {Datum} from "./Datum";
import {Operations} from "./Topics/Topic";

interface ReturnResolution {
    data: Array<Datum>,
    requested: Array<keyof Operations>,
    resolution: Array<Datum>,
}

interface DataObj {
    name : string,
    value : string,
    unit : string,
}

// TODO: Problem solver class

export {DataObj};
