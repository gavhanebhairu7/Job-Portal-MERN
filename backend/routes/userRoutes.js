import express from "express"
import { loginUser, registerUser, logout as logoutUser, getUser, updateUser, changePassword } from "../controller/userController.js"
import { errorMiddleware } from "../middlewares/error.js"
import { isAuthentic } from "../middlewares/Auth.js"
const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(isAuthentic, logoutUser)
router.route("/getuser").get(isAuthentic, getUser)
router.route("/update/profile").put(isAuthentic, updateUser)
router.route("/update/password").put(isAuthentic, changePassword)
export default router
