import {Datum} from "./Datum";
import {Operations} from "./Topics/Topic";
import {Wit, Entity} from "./Wit";
import {TopicNotFound} from "../Exceptions/Problem/TopicNotFound";
import {Problem} from "./Problem";

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

class ProblemSolver {

    problem : string; // Problem to resolve
    requested : Array<keyof Operations>; // Data that are requested
    data : Array<Datum>; // Data of problem

    constructor (problem : string, requested : Array<keyof Operations> = []) {
        this.problem = problem;
        this.requested = requested;
        this.data = [];
    }

    /**
     *
     */
    processProblem (): Promise<ReturnResolution> {

        return new Promise<ReturnResolution>( (success, failure) => {

            // Init Wit class
            let wit : Wit;

            try {
                wit = new Wit();
            } catch (err) {
                return failure(err);
            }

            // Process message
            wit.processMessage(this.problem).then( () => {

                // Get requested data
                this.loadRequestedData(wit.entities);

                // Load rest of entities
                const entitiesWithoutRequested = wit.entities.filter((entity: Entity) => {
                    return entity.name !== "se_solicita";
                });

                this.loadData(entitiesWithoutRequested).then( () => {

                    // When we have all the data, we process it
                    let problemSolved: ReturnResolution;

                    try {
                        problemSolved = this.resolveProblem();
                    } catch(errResolveProblem: unknown) {
                        return failure(errResolveProblem);
                    }

                    // Return the solution
                    return success(problemSolved);
                });

            }).catch( (errProcessMessage : Error) => {
                return failure(errProcessMessage);
            });
        });
    }

    resolveProblem (): ReturnResolution {

        // When we have all the data, we process it
        const problem = new Problem(this.requested, this.data);

        // Check resolution
        let resolution : Array<Datum> = [];

        try {
            resolution = problem.check(this.requested, this.data);
        } catch(errorCheck: unknown) {

            if(errorCheck instanceof TopicNotFound)
                throw errorCheck;

            throw new Error("Error when check the problem");
        }

        // Return the response
        return {
            data: this.data,
            requested: this.requested,
            resolution,
        };
    }

    /**
     *
     * @param entities
     */
    loadRequestedData (entities : Array<Entity>): void {

        entities.forEach( (entity : Entity, iEntity : number) => {

            if(entity.name === "se_solicita") {
                this.requested.push(this.parseAndNormalizeDataName(entities[iEntity + 1].value));
            }
        });
    }

    /**
     *
     * @param entities
     */
    loadData (entities : Array<Entity>): Promise<void> {

        return new Promise<void>( async (success, failure) => {

            for(const entity of entities) {

                // Init data
                const datum = new Datum();
                const responseDatumLoad: Array<Entity> | Datum | null = await datum.loadEntity(entity).catch((errDatumLoad: string) => {
                    return null;
                });

                // Check for null and continue with the next entity
                if(!responseDatumLoad) {
                    continue;
                }

                // If instance of Datum, we add to the data array
                if (responseDatumLoad instanceof Datum) {

                    this.data.push(responseDatumLoad);

                } else {

                    // If it's not, we load the new entities
                    await this.loadData(responseDatumLoad).catch((errLoadData: string) => {
                        return failure(errLoadData);
                    });
                }

            }

            return success();

        });
    }

    /**
     *
     * @param data
     */
    addData (data : Array<DataObj>): void {

        for(const dataObject of data) {
            this.data.push(new Datum(dataObject.name, dataObject.value, dataObject.unit));
        }

    }

    /**
     *
     * @param value
     */
    parseAndNormalizeDataName (value : string): keyof Operations {

        // Get next entity that is data we need
        value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Parse and remove accents
        value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Remove spaces and replace with underscore
        value = value.replace(/ /g, "_");

        if(value === "metros")
            value = "distancia";

        return value as keyof Operations;
    }
}

export {ProblemSolver, DataObj};
