import { Router } from "express";
import { cerateUser, loginUser } from "../controllers/UserController";

const router = Router();

router.post("/user/create-user", cerateUser);
router.post("/user/login", loginUser);

export default router;
