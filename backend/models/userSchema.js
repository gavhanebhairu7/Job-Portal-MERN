import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt, { compare } from "bcrypt"
import validator from "validator"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "name should have atleast 3 characters"],
    maxLength: [30, "name length exceeded limit"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide valid email"],
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "password should have atleast 8 characters"],
    maxLength: [32, "passworrd cannot exceed 32 characters"],
    select: false,
  },
  niches: {
    firstNiche: String,
    secondNiche: String,
    thirdNiche: String,
  },
  resume: {
    public_id: String,
    url: String,
  },
  coverLetter: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

userSchema.methods.getJwtToken = function () {
  console.log(this)
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
  return token
}

userSchema.methods.validatePassword = async function (password) {
  const bcrypt_res = await bcrypt.compare(password, this.password)
  return bcrypt_res
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

export const User = mongoose.model("user", userSchema)
