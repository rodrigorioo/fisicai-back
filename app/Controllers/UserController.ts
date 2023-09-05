import {Request, Response} from "express";
import {UserService} from "../Services/User.service";

export default {

    /**
     *
     * @param req
     * @param res
     */
    register (req: Request, res: Response) {

        // Get data from request
        const email: string =  req.body.email || req.query.email;
        const password: string = req.body.password || req.query.password;

        // Init service
        const userService = new UserService();

        // Login
        userService.register(email, password).then( (dataRegister) => {
            res.status(200).send(dataRegister);
        }).catch( (err) => {
            res.status(err.code).send({
                message: err.message,
            });
        });
    },
}
