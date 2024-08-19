class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal Server Error"

  if (err.name === "CastError") {
    err.message = `Invalid ${err.path}`
    err = new ErrorHandler(err.message, 400)
  }

  if (err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} entered.`
    err = new ErrorHandler(err.message, 400)
  }

  if (err.name === "JsonWebTokenError") {
    err.message = `Json token is invalid, try again`
    err = new ErrorHandler(err.message, 400)
  }

  if (err.name === "TokenExpiredError") {
    err.message = `Json web token expired, try again`
    err = new ErrorHandler(err.message, 400)
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
}

export { errorMiddleware, ErrorHandler }
