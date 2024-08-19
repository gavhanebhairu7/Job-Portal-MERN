import { configureStore } from "@reduxjs/toolkit"
import JobReducers from "./slices/jobSlices"
import userReducer from "./slices/userSlice"
import appReducer from "./slices/applicationSlice"
import updateProfileReducer from "./slices/updateProfile"
const store = configureStore({
  reducer: {
    jobs: JobReducers,
    users: userReducer,
    applications: appReducer,
    updateProfile: updateProfileReducer,
  },
})

export default store
