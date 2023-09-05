import express, {Router} from "express";

// Controllers
import UserController from "../Controllers/UserController";

const router: Router = express.Router();

// User
router.post('/register', UserController.register);

export default router;
