export const sendToken = (user, statusCode, req, res) => {
  const token = user.getJwtToken()
  //for remote
  // const options = { expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true, secure: true, sameSite: "None" }
  const options = { expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true }

  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    data: user,
    message: "token generated for user",
  })
}
