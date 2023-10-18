import express, {Router} from "express";
import {AuthJWT} from "../Middlewares/AuthJWT";

// Controllers
import ProblemController from "../Controllers/ProblemController";
import UserController from "../Controllers/UserController";

// Init router
const router: Router = express.Router();

// Problems
router.post(
    '/solve-problem',
    [AuthJWT.verifyToken],
    ProblemController.solve
);
router.get(
    '/problems',
    [AuthJWT.verifyToken],
    ProblemController.get
);

// User
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get(
    '/auth',
    [AuthJWT.verifyToken],
    UserController.checkAuth
);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/check-forgot-password-code', UserController.checkForgotPasswordCode);
router.post('/change-password-forgotten', UserController.changePasswordForgotten);

export default router;
