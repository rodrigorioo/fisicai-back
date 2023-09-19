import express, {Router} from "express";

// Controllers
import UserController from "../Controllers/UserController";

// Init router
const router: Router = express.Router();

// User
router.post('/register', UserController.register);
router.post('/forgot-password', UserController.forgotPassword);

export default router;
