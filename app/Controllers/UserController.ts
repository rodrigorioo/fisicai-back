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

    /**
     *
     * @param req
     * @param res
     */
    forgotPassword (req: Request, res: Response) {

        // Get data from request
        const email: string =  req.body.email || req.query.email;

        // Init service
        const userService = new UserService();

        // Login
        userService.forgotPassword(email).then( (dataForgot) => {
            res.status(200).send(dataForgot);
        }).catch( (err) => {
            res.status(err.code).send({
                message: err.message,
            });
        });
    },

    checkForgotPasswordCode (req: Request, res: Response) {

        // Get data from request
        const code: string =  req.body.code || req.query.code;

        // Init service
        const userService = new UserService();

        // Login
        userService.checkForgotPasswordCode(code).then( (dataCheckCode) => {
            res.status(200).send(dataCheckCode);
        }).catch( (err) => {
            res.status(err.code).send({
                message: err.message,
            });
        });
    },

    changePasswordForgotten (req: Request, res: Response) {

        // Get data from request
        const code: string =  req.body.code || req.query.code;
        const password: string =  req.body.password || req.query.password;

        // Init service
        const userService = new UserService();

        // Login
        userService.changePasswordForgotten(code, password).then( (dataChangePassword) => {
            res.status(200).send(dataChangePassword);
        }).catch( (err) => {
            res.status(err.code).send({
                message: err.message,
            });
        });
    },
}
