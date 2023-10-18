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

        // TODO: Solve problem
        res.json("ok");
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

