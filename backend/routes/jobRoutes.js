import express from "express"
import { isAuthentic, isAuthorised } from "../middlewares/Auth.js"
import { addJob, getAllJobs, getMyJobs, getJobById, deleteJobById } from "../controller/jobController.js"

const router = express.Router()

router.route("/newjob").post(isAuthentic, isAuthorised("Employer"), addJob)
router.route("/alljobs").get(getAllJobs)
router.route("/myjobs").get(isAuthentic, isAuthorised("Employer"), getMyJobs)
router.route("/:id").get(isAuthentic, getJobById)
router.route("/:id").delete(isAuthentic, isAuthorised("Employer"), deleteJobById)
// router.route("/delete/:id").delete(isAuthentic, isAuthorised("Employer"), deleteJobById)
export default router
