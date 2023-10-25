import {ProblemModel} from "../Models/Problem.model";
import {IResolution} from "../Controllers/ProblemController";
import {ProblemSolver} from "../Models/ProblemSolver";
import {OkPacket} from "mysql";

export class ProblemService {

    /**
     * Solve the problem and response with data, requested data and resolution
     * @param problem
     * @param resolution
     * @param userId
     */
    solve (problem: string, resolution: IResolution, userId: string) {

        return new Promise( (resolve, reject) => {

            // Process the data sended by user
            if (resolution) {

                // Init class
                const problemSolver = new ProblemSolver(problem, resolution.requested);
                problemSolver.addData(resolution.data);

                // Solve the problem
                let problemSolved;

                try {
                    problemSolved = problemSolver.resolveProblem();
                } catch (errResolveProblem: unknown) {

                    const message: string = (errResolveProblem instanceof Error) ? errResolveProblem.message : "Error in solve problem";

                    return reject(message);
                }

                return resolve(problemSolved);

            }

            // Process the problem
            if (problem) {

                // Init class
                const problemSolver = new ProblemSolver(problem);

                // Solve the problem
                problemSolver.processProblem().then((problemSolved) => {

                    // Load problem to database
                    ProblemModel.create({
                        user_id: userId,
                        problem,
                        processed_data: JSON.stringify(problemSolved),
                    }).then( (problemModel: OkPacket) => {

                        // const problemId = problemModel.insertId;

                        return resolve(problemSolved);

                    });

                }).catch((err) => {
                    return reject(`Solve problem error: ${err.message}`)
                });
            }
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
