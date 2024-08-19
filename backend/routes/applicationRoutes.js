import express from "express"
import { isAuthentic, isAuthorised } from "../middlewares/Auth.js"
import {
  createNewApplication,
  replyApplication,
  deleteApplication,
  getMyApplications,
  getAllApplications,
} from "../controller/applicationController.js"
const router = express.Router()

router.get("/myapplications", isAuthentic, isAuthorised("Job Seeker"), getMyApplications)
//param id is of job
router.post("/apply/:id", isAuthentic, isAuthorised("Job Seeker"), createNewApplication)

// .get(isAuthentic, isAuthorised("Job Seeker Employer"), getApplicationDetails)
router.put("/:id", isAuthentic, isAuthorised("Employer"), replyApplication).delete("/:id", isAuthentic, isAuthorised("Job Seeker"), deleteApplication)
router.get("/emp/applications", isAuthentic, isAuthorised("Employer"), getAllApplications)

export { router as ApplicationRouter }
