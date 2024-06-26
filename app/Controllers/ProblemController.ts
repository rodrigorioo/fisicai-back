import {Request, Response} from "express";
import {DataObj} from "../Models/ProblemSolver";
import {Operations} from "../Models/Topics/Topic";
import {ProblemService} from "../Services/Problem.service";

export interface IResolution {
    requested : Array<keyof Operations>,
    data : Array<DataObj>,
}

export default {

    /**
     *
     * @param req
     * @param res
     */
    solve (req: Request, res: Response) {

        const problem: string = req.query.problem || req.body.problem;
        const resolution: IResolution = req.query.resolution || req.body.resolution;

        if (resolution) {

            // Valid if keys exists in object
            if (!("requested" in resolution) || !("data" in resolution)) {
                res.status(500).send({
                    message: "El parámetro de resolución no está completo",
                });
                return;
            }

            // Valid if are array
            if (!Array.isArray(resolution.requested) || !Array.isArray(resolution.data)) {
                res.status(500).send({
                    message: "Algunas de las keys de la resolución no están presentes",
                });
                return;
            }

        }

        if(problem || resolution) {

            // Init service
            const problemService = new ProblemService();

            // Solve problem
            problemService.solve(problem, resolution, req.userId).then( (problemSolved) => {

                res.json(problemSolved);

            }).catch( (errMessage: string) => {
                res.status(500).send({
                    message: errMessage,
                });
            });
        } else {
            res.status(422).send({
                message: 'Se necesita el problema o los parámetros a resolver',
            });
        }
    },

    /**
     *
     * @param req
     * @param res
     */
    get (req: Request, res: Response) {

        // Init service
        const problemService = new ProblemService();

        // Get problems
        problemService.get(req.userId).then( (problems) => {
            res.json(problems);
        }).catch( (errMessage) => {
            res.status(500).send({
                message: errMessage,
            });
        });
    }
};

