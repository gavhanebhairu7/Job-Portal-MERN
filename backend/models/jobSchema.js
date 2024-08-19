import mongoose from "mongoose"

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["part-time", "full-time"],
  },
  location: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
  },
  responsibilities: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    required: true,
  },
  offers: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
  },
  positions: {
    type: Number,
    default: -1,
  },
  companyWebsite: {
    title: {
      type: String,
      default: "Company website",
    },
    url: {
      type: String,
      required: [true, "website url is required"],
    },
  },
  jobNiche: {
    type: String,
    required: true,
  },
  newsLettersSent: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  jobPostedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const Jobs = mongoose.model("Job", JobSchema)
export { Jobs as Job }
