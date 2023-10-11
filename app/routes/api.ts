import express, {Router} from "express";
import {AuthJWT} from "../Middlewares/AuthJWT";

// Controllers
import UserController from "../Controllers/UserController";

// Init router
const router: Router = express.Router();

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
