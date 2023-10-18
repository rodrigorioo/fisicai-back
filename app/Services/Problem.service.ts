import {ProblemModel} from "../Models/Problem.model";
import {IResolution} from "../Controllers/ProblemController";

export class ProblemService {

    /**
     * Solve the problem and response with data, requested data and resolution
     * @param problem
     * @param resolution
     * @param userId
     */
    solve (problem: string, resolution: IResolution, userId: string) {

        return new Promise( (resolve, reject) => {

            // TODO: Solve problem

            resolve("");
        });
    }

    /**
     * Return all problems of the auth user
     * @param userId
     */
    get (userId: string) {

        return new Promise( (resolve, reject) => {
            ProblemModel.get({
                user_id: userId
            }, {
                id: "DESC",
            })
                .then( (problems) => {
                    resolve(problems);
                }).catch( (err) => {
                    reject(err.message);
            });
        });
    }
}
