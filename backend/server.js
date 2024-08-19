import app from "./app.js"
import cloudinary from "cloudinary"
//config cloudinary before server starting

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.listen(4000, () => {
  console.log(`Server is listening on port ${process.env.PORT}`)
})
