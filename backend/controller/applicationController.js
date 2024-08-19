import mongoose from "mongoose"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import { ErrorHandler } from "../middlewares/error.js"
import { Job } from "../models/jobSchema.js"
import { v2 as cloudinary } from "cloudinary"
import { Application } from "../models/applicationSchema.js"
import e from "express"
import { User } from "../models/userSchema.js"

const createNewApplication = catchAsyncErrors(async (req, res, next) => {
  //
  const already_applied = await Application.findOne({ "jobInfo.jobId": req.params.id, "applicantInfo.id": req.user._id })
  if (already_applied) {
    return next(new ErrorHandler("you have already applied for this job !"))
  }
  const job_id = req.params.id
  if (!job_id) {
    console.log("job id is undefined")
    return next(new ErrorHandler("invalid request", 400))
  }
  var { name, email, phone, address, coverLetter } = req.body
  var { _id } = req.user
  console.log("req.body: ", req.body)
  const job_details = await Job.findById(job_id)
  if (!job_details) {
    return next(new ErrorHandler("no job details found", 404))
  }
  //employee info
  const emp_id = job_details.jobPostedBy
  console.log(emp_id)
  const emp_details = await User.findById(emp_id.toString())
  if (!emp_details) {
    return next(new ErrorHandler("something went wrong", 501))
  }
  const emp_name = emp_details.name
  //job info
  const jobId = req.params.id
  const jobTitle = job_details.title
  var newResume = null
  if (req.files && req.files.resume) {
    const { resume } = req.files
    try {
      const cloud_response = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "job_seekers_resume" })
      if (!cloud_response) {
        console.log("Application Controller :: error :: unable to upload file to cloudinary")
        return next(new ErrorHandler("Internal Server Error", 501))
      }
      newResume = { public_id: cloud_response.public_id, url: cloud_response.secure_url }
      newResume.url = newResume.url.replace(".pdf", ".jpeg")
      console.log(newResume)
    } catch (err) {
      console.log("application controller :: error :: ", err)
      return next(new ErrorHandler("internal server error", 501))
    }
  }
  if (!newResume) {
    newResume = req.user.resume
    if (!newResume || !newResume.url || !newResume.public_id) {
      return next(new ErrorHandler("please provide the resume"))
    }
  }
  var db_response = await Application.create({
    applicantInfo: { id: _id, name, email, phone, address, resume: newResume, coverLetter },
    employerInfo: { id: emp_id, name: emp_name },
    jobInfo: { jobId, jobTitle },
  })
  if (db_response) {
    return res.status(201).json({
      success: true,
      data: db_response,
      message: "application successful !",
    })
  } else {
    return next(new ErrorHandler("error occured while saving file !", 400))
  }
})
const getAllApplications = catchAsyncErrors(async (req, res, next) => {
  //
  const user_id = req.user.id
  var query = { "employerInfo.id": user_id }
  if (req.query.jobId) {
    query = { ...query, "jobInfo.jobId": req.query.jobId }
  }
  if (req.query.status) {
    query.status = { $regex: req.query.status, $options: "i" }
  }
  console.log(query)
  const db_response = await Application.find(query)
  console.log(db_response)
  return res.status(201).json({
    status: true,
    data: db_response,
  })
})
const replyApplication = catchAsyncErrors(async (req, res, next) => {
  //
  const user_id = req.user._id
  const appId = req.params.id
  var { approve } = req.query
  if (approve === "true") {
    approve = "Approved"
  } else {
    approve = "Rejected"
  }
  var application = await Application.findById(appId)
  if (!application.employerInfo.id.equals(user_id)) {
    // console.log(application.employerInfo.id)
    // console.log(user_id)
    return next(new ErrorHandler("you are not authorized for this action"))
  }
  application.status = approve
  application.updatedAt = new Date()
  const db_response = await application.save()
  // const db_response = await Application.updateOne({ _id: appId }, { status: approve })
  if (db_response) {
    return res.status(201).json({
      success: true,
      data: db_response,
      message: "updated successfully ",
    })
  } else {
    return next(new ErrorHandler("unable to update", 501))
  }
})
const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  //applicant is authorised to delete application
  const user_id = req.user._id
  const app_id = req.params.id
  const application = await Application.findById(app_id)
  if (!application) {
    return next(new ErrorHandler("application is not found!", 404))
  }
  if (!application.applicantInfo?.id.equals(user_id)) {
    return next(new ErrorHandler("you aren't authorised to perform this action", 400))
  }
  const db_response = await Application.findByIdAndDelete(app_id)
  if (!db_response) {
    return next(new ErrorHandler("action could not be completed !"))
  }
  return res.status(200).json({
    success: true,
    data: db_response,
    message: "application is deleted successfully",
  })
})
const getMyApplications = catchAsyncErrors(async (req, res, next) => {
  //getting all the application listed for applicant
  const user_id = req.user._id
  console.log(user_id)
  const all_application_details = await Application.find({ "applicantInfo.id": user_id })
  if (!all_application_details) {
    return next(new ErrorHandler("no applications found, start applying now !"))
  }
  return res.status(202).json({
    success: true,
    data: all_application_details,
    message: "fetched successfully !",
  })
})

export { createNewApplication, getAllApplications, replyApplication, deleteApplication, getMyApplications }
