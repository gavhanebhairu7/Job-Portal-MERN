import catchAsynchronousErr from "../middlewares/catchAsyncErrors.js"
import { errorMiddleware, ErrorHandler } from "../middlewares/error.js"
import { User } from "../models/userSchema.js"
import { v2 as cloudinary } from "cloudinary"
import { sendToken } from "../utils/jwtToken.js"

const registerUser = catchAsynchronousErr(async (req, res, next) => {
  try {
    const { name, email, phone, address, password, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body

    if (!phone || !address || !name || !email || !password || !role) {
      return next(new ErrorHandler("All fields are required", 400))
    }
    if (role === "Job Seeker " && (!firstNiche || !thirdNiche || !secondNiche)) {
      return next(new ErrorHandler("please provide your preferred niches"))
    }
    const user_already_exists = await User.findOne({ email })
    if (user_already_exists) {
      return next(new ErrorHandler("User already exists, kindly login", 400))
    }

    const user_data = { name, email, phone, address, password, role, niches: { firstNiche, secondNiche, thirdNiche }, coverLetter }
    if (req.files && req.files.resume) {
      const { resume } = req.files
      if (resume) {
        try {
          const cloud_response = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "job_seekers_resume" })

          if (!cloud_response || cloud_response.error) {
            return next(new ErrorHandler("Error while uploading file", 500))
          }

          user_data.resume = {
            public_id: cloud_response.public_id,
            url: cloud_response.secure_url,
          }
        } catch (err) {
          return next(new ErrorHandler(err.message, 501))
        }
      }
    }
    const result = await User.create(user_data)
    if (!result) {
      return next(new ErrorHandler("Internal Server Error", 501))
    }

    return sendToken(result, 201, req, res)
  } catch (err) {
    console.log("Error :: UserController :: ", err)
    next(new ErrorHandler(err.message, 502))
  }
})

//login

const loginUser = catchAsynchronousErr(async (req, res, next) => {
  const { email, password, role } = req.body
  if (!email || !password || !role) {
    return next(new ErrorHandler("all fields are required", 400))
  }
  const user_if_registered = await User.findOne({ email }).select("+password")
  if (!user_if_registered) {
    return next(new ErrorHandler("user was not registered", 400))
  }
  if (user_if_registered.role != role) {
    return next(new ErrorHandler("invalid credentials: role"))
  }
  //validate password
  if (!(await user_if_registered.validatePassword(password))) {
    return next(new ErrorHandler("email or password is invalid", 400))
  }
  //generate token
  return sendToken(user_if_registered, 201, req, res)
})

const logout = catchAsynchronousErr(async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return next(new ErrorHandler("No active session", 400))
  }
  return res.status(201).cookie("token", "", { httpOnly: true, expires: new Date() }).json({
    success: true,
    message: "user logged out successfully",
  })
})

const getUser = catchAsynchronousErr(async (req, res, next) => {
  const { id } = req.user
  const user = await User.findById(id)
  if (!user) {
    return next(new ErrorHandler("no user details found", 404))
  }
  return res.status(201).json({
    success: true,
    data: user,
    message: "data fetched successfully",
  })
})

const updateUser = catchAsynchronousErr(async (req, res, next) => {
  const new_user_data = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
    coverLetter: req.body.coverLetter,
  }

  const { firstNiche, secondNiche, thirdNiche } = req.body
  if (req.user.role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(new ErrorHandler("All Niches are mandatory", 400))
  }
  if (req.files && req.files.resume) {
    const { resume } = req.files
    if (resume) {
      //remove old resume from cloudinary
      const result = await cloudinary.uploader.destroy(req.user.resume.public_id)
      if (result) {
        console.log("Old resume destroyed successfully, result: ", result)
      }
      const cloud_response = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "job_seekers_resume" })
      if (!cloud_response || cloud_response.error) {
        return next(new ErrorHandler("failed to upload file", 400))
      }
      new_user_data.resume = {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      }
    }
  }
  //save data to database
  const db_response = await User.updateOne({ _id: req.user._id }, new_user_data)

  if (!db_response) {
    return next(new ErrorHandler("failed to update the file", 501))
  }
  return res.status(201).json({
    success: true,
    data: db_response,
    message: "user profile is updated successfully",
  })
})

const changePassword = catchAsynchronousErr(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("all fields are mandatory", 400))
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("password and confirm password should match", 400))
  }

  const user = await User.findOne({ _id: req.user._id }).select("+password")
  if (!user) {
    return next(new ErrorHandler("email not registered", 404))
  }

  const password_validation = await user.validatePassword(oldPassword)
  if (!password_validation) {
    return next(new ErrorHandler("old password is incorrect", 400))
  }

  user.password = newPassword
  user.save()
  return res.status(201).json({
    success: true,
    message: "password updated successfully",
  })
})

export { registerUser, loginUser, logout, getUser, updateUser, changePassword }
