import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/Users.controllers.js";
import { VerifyJwt } from "../auth.js";
const router = Router()
router.route("/register").post(
    registerUser
)
router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(VerifyJwt, logoutUser)

export default router
