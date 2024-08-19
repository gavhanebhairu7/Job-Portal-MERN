import express from "express"
import { config } from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connection } from "./database/connection.js"
import { errorMiddleware } from "./middlewares/error.js"
import fileUpload from "express-fileupload"
import userRouter from "./routes/userRoutes.js"
import jobRouter from "./routes/jobRoutes.js"
import { ApplicationRouter } from "./routes/applicationRoutes.js"
const app = express()
config({ path: "./config/config.env" })

app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

connection()
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URI)
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
})

app.use("/api/v1/user", userRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/application", ApplicationRouter)
app.use(errorMiddleware)
export default app
