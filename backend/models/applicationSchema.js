import mongoose from "mongoose"
import validator from "validator"
import { Job } from "./jobSchema.js"

var ApplicationSchema = new mongoose.Schema({
  applicantInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "applicants id is required"],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "provide the valid email"],
    },
    phone: {
      type: Number,
      required: [true, "Phone is required"],
    },
    address: {
      type: String,
      required: true,
    },
    resume: {
      url: {
        type: String,
        required: [true, "url is required"],
      },
      public_id: {
        type: String,
        required: [true, "public id is required"],
      },
    },
    coverLetter: {
      type: String,
      required: true,
    },
  },
  employerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
})

const Application = mongoose.model("Application", ApplicationSchema)

//! use regular functions here to maintain the context of this
ApplicationSchema.pre("save", function (next) {
  console.log("updating date !")
  this.updatedAt = new Date()
  next()
})

ApplicationSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date()
  next()
})

ApplicationSchema.pre("updateOne", function (next) {
  this._update.updatedAt = new Date()
  next()
})

export { Application }
