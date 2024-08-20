import catchAsynchronousErr from "../middlewares/catchAsyncErrors.js"
import { errorMiddleware, ErrorHandler } from "../middlewares/error.js"
import { User } from "../models/userSchema.js"
import { Job } from "../models/jobSchema.js"
import mongoose from "mongoose"
const addJob = catchAsynchronousErr(async (req, res, next) => {
  const {
    title,
    type,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    positions,
    companyWebsiteTitle,
    companyWebsiteUrl,
    jobNiche,
  } = req.body

  if (!title || !type || !location || !companyName || !responsibilities || !qualifications || !salary || !jobNiche) {
    return next(new ErrorHandler("please provide full job details", 400))
  }

  if (companyWebsiteTitle && !companyWebsiteUrl) {
    return next(new ErrorHandler("please provide website url !", 400))
  }
  const jobPostedBy = req.user._id

  const db_response = await Job.create({
    title,
    type,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    positions,
    companyWebsite: {
      title: companyWebsiteTitle,
      url: companyWebsiteUrl,
    },
    jobNiche,
    jobPostedBy,
  })

  if (db_response) {
    return res.status(201).json({
      success: true,
      message: "job posted successfully !",
      data: db_response,
    })
  } else {
    return next(new Error("database error", 400))
  }
})

const getAllJobs = catchAsynchronousErr(async (req, res, next) => {
  const { city, niche, searchKeyword } = req.query
  const query = {}
  if (city) {
    query.location = city
  }
  if (niche) {
    query.jobNiche = niche
  }
  if (searchKeyword) {
    query.$or = [
      mongoose.Types.ObjectId.isValid(searchKeyword) ? { _id: new mongoose.Types.ObjectId(searchKeyword) } : null,
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
      { location: { $regex: searchKeyword, $options: "i" } },
    ].filter((condition) => condition !== null)
  }

  const obj = await Job.find(query)
  return res.status(201).json({
    success: true,
    data: obj,
    message: "fetched details successfully",
  })
})

const getMyJobs = catchAsynchronousErr(async (req, res, next) => {
  const id = req.user._id
  const myJobs = await Job.find({ jobPostedBy: id })
  return res.status(201).json({
    success: true,
    message: "jobs fetched successfully",
    data: myJobs,
  })
})

const getJobById = catchAsynchronousErr(async (req, res, next) => {
  const id = req.params.id
  if (!id) {
    return next(new ErrorHandler("job id is undefined", 400))
  }
  const job_for_id = await Job.findOne({ _id: id })
  if (!job_for_id) {
    return next(new ErrorHandler("oops!, no job details found", 404))
  }
  return res.status(201).json({
    success: true,
    data: job_for_id,
    message: "job details fetched successfully",
  })
})

const deleteJobById = catchAsynchronousErr(async (req, res, next) => {
  const id = req.params.id
  if (!id) {
    return next(new ErrorHandler("id is undefined", 400))
  }
  let db_response = await Job.findOne({ _id: id })
  if (!db_response) {
    return res.status(404).json({
      success: false,
      message: "No data found !",
    })
  }
  if (!db_response.jobPostedBy.equals(req.user._id)) {
    return next(new ErrorHandler("you are not authorised to delete this job", 400))
  }
  db_response = await Job.deleteOne({ _id: id })
  if (db_response) {
    return res.status(201).json({
      success: true,
      message: "deleted successfully",
      data: db_response,
    })
  }
})
export { addJob, getAllJobs, getMyJobs, getJobById, deleteJobById }
