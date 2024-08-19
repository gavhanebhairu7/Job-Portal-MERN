import mongoose, { mongo } from "mongoose";

export const connection =()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName:"JOB_PORTAL_AUTOMATION"
    })
    .then(()=>{
        console.log("Connected to database")
    })
    .catch((err)=>{
        console.log("Error occured while connecting to database: ", err);
    })
}