import axios, {AxiosResponse} from "axios";

type Entity = {
    id : string,
    name : string,
    role : string,
    start : number,
    end : number,
    body : string,
    confidence : number,
    entities : object,
    normalizerd : object,
    unit : string,
    value : string,
    type : string,
    grain : string,
};

class Wit {

    url: string = "";
    accessToken: string = "";
    entities: Array<Entity> = [];
    traits: Array<any> = [];

    constructor () {

        if(!process.env.WIT_URL || !process.env.WIT_ACCESS_TOKEN) {
            throw new Error("Access Token not defined");
        }

        this.url = process.env.WIT_URL;
        this.accessToken = process.env.WIT_ACCESS_TOKEN;

        this.entities = [];
        this.traits = [];
    }

    processMessage (message : string) : Promise<void> {

        return new Promise<void>( (success, failure) => {

            axios.get(this.url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                },
                params: {
                    q: message,
                },
            })
                .then( (response : AxiosResponse) => {

                    const dataWit = response.data;

                    // Process entities
                    const entitiesObj = dataWit.entities;

                    // Add all entities object to an array
                    Object.values(entitiesObj).forEach( (entities : any) => {

                        entities.forEach( (entity : Entity) => {

                            // Check if entity is not a number (wit$number) and is a single word
                            if(entity.name !== "wit$number" && !['Un', 'Una', 'un', 'una'].includes(entity.body)) {
                                this.entities.push(entity);
                            }
                        })
                    });

                    // Order the array using "start"
                    this.entities.sort( (a : Entity, b : Entity) => {
                        if(a.start > b.start) {
                            return 1;
                        } else if(a.start < b.start) {
                            return -1;
                        }

                        return 0;
                    });

                    // Process traits
                    // TODO:

                    return success();

                })
                .catch( (error : string) => {
                    throw new Error(error);
                });

        });
    }

}

export { Wit, Entity };
