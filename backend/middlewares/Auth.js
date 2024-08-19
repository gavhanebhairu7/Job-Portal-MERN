import { User } from "../models/userSchema.js"
import catchAsyncErrors from "./catchAsyncErrors.js"
import { ErrorHandler } from "./error.js"
import jwt from "jsonwebtoken"
const isAuthentic = catchAsyncErrors(async function (req, res, next) {
  const { token } = req.cookies
  console.log("cookies: ", req.cookies)
  console.log("token: ", token)
  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 400))
  }
  const decoded_id = jwt.verify(token, process.env.JWT_SECRET_KEY)
  if (!decoded_id) {
    return next(new ErrorHandler("User is not authenticated", 400))
  }
  //inserted decoded id in each request so that it helps in further operations related to user
  req.user = await User.findById(decoded_id.id)
  return next()
})

const isAuthorised = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("user is not authorised for this action", 400))
    }
    next()
  }
}

export { isAuthentic, isAuthorised }
