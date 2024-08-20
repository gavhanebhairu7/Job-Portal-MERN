import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { useSelector } from "react-redux"
let baseURL = import.meta.env.VITE_BASE_URL

axios.defaults.baseURL = `${baseURL}`

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    job: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    myJobs: [],
    niches: [
      "Software Development",
      "Web Development",
      "Cybersecurity",
      "Data Science",
      "Artificial Intelligence",
      "Cloud Computing",
      "DevOps",
      "Mobile App Development",
      "Blockchain",
      "Database Administration",
      "Network Administration",
      "UI/UX Design",
      "Game Development",
      "IoT (Internet of Things)",
      "Big Data",
      "Machine Learning",
      "IT Project Management",
      "IT Support and Helpdesk",
      "Systems Administration",
      "IT Consulting",
    ],
    cities: ["Bangalore", "Hyderabad", "Pune", "Chennai", "Gurgaon", "Noida", "Mumbai", "Kolkata", "Chandigarh", "Ahmedabad", "Nagpur"],
  },

  reducers: {
    requestForAllJobs(state, action) {
      state.loading = true
      state.error = null
    },
    successForAllJobs(state, action) {
      state.loading = false
      state.job = [...action.payload]
      state.error = null
      console.log("state.jobs: ", state.job)
    },
    failureForAllJobs(state, action) {
      state.loading = false
      state.error = action.payload
    },

    requestForMyJobs(state, action) {
      state.loading = true
      state.error = null
    },
    successForMyJobs(state, action) {
      state.loading = false
      state.myJobs = [...action.payload]
      state.error = null
    },
    failureForMyJobs(state, action) {
      state.loading = false
      state.error = action.payload
    },

    //fetch single job
    requestForSingleJob(state, action) {
      state.loading = true
      state.error = null
    },
    successForSingleJob(state, action) {
      state.loading = false
      state.singleJob = action.payload
      state.error = null
      console.log("state.jobs: ", state.job)
    },
    failureForSingleJob(state, action) {
      state.loading = false
      state.error = action.payload
    },

    requestForPostJob(state, action) {
      state.loading = true
      state.error = null
    },
    successForPostJob(state, action) {
      state.loading = false
      state.message = "Job Posted Successfully"
    },
    failureForPostJob(state, action) {
      state.loading = false
      state.error = action.payload
    },

    successForDeleteJob(state, action) {
      state.loading = false
      state.message = action.payload
    },

    clearAllError(state, action) {
      state.error = null
      state.job = state.job
    },
    resetJobSlice(state, action) {
      state.error = null
      state.job = state.job
      state.message = null
      state.loading = false
      state.myJobs = state.myJobs
      state.singleJob = {}
    },
  },
})

export const fetchJob =
  (city, niche, searchKeyword = "") =>
  async (dispatch) => {
    try {
      console.log("base url: ", baseURL)
      dispatch(jobSlice.actions.requestForAllJobs())
      let link = "/job/alljobs?"
      let query = []
      if (niche) query.push(`niche=${niche}`)
      if (city) query.push(`city=${city}`)
      if (searchKeyword) query.push(`searchKeyword=${searchKeyword}`)
      link += query.join("&")
      const jobs_db_response = await axios.get(link, { withCredentials: true })
      dispatch(jobSlice.actions.successForAllJobs(jobs_db_response.data.data))
    } catch (err) {
      if (err.request) {
        console.log("cannot send request")
        dispatch(jobSlice.actions.failureForAllJobs("failed to send request"))
      }
      dispatch(jobSlice.actions.failureForAllJobs(err?.response?.data?.message))
      console.log("jobSlice:: fetchjob error:response ", err)
    }
    dispatch(jobSlice.actions.clearAllError())
  }

export const selectSortedJobs = (sortBy) => async (dispatch, getState) => {
  let sortedJobs
  const { job } = getState().jobs
  switch (sortBy) {
    case "salary":
      sortedJobs = [...job].sort((a, b) => b.salary - a.salary)
      break
    case "position":
      sortedJobs = [...job].sort((a, b) => b.positions - a.positions)
      break
    case "posted-latest":
      sortedJobs = [...job].sort((a, b) => new Date(b.jobPostedOn) - new Date(a.jobPostedOn))
      break
    case "posted-earliest":
      sortedJobs = [...job].sort((a, b) => new Date(a.jobPostedOn) - new Date(b.jobPostedOn))
      break
    default:
      sortedJobs = job
      break
  }
  console.log("SortedArray: ", sortedJobs)
  dispatch(jobSlice.actions.successForAllJobs(sortedJobs))
}

//fetching single job to display job details

export const fetchSingleJob = (id) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForSingleJob())
    const jobs_db_response = await axios.get(`/job/${id}`, { withCredentials: true })
    dispatch(jobSlice.actions.successForSingleJob(jobs_db_response.data.data))
  } catch (err) {
    if (err.message === "Network Error") {
      console.log("cannot send request")
      dispatch(jobSlice.actions.failureForSingleJob("failed to send request"))
    }
    dispatch(jobSlice.actions.failureForSingleJob(err.response.data.message))
    console.log("jobSlice:: fetchjob error:response ", err)
  }
  dispatch(jobSlice.actions.clearAllError())
}

//get myposted job
export const fetchMyJob = () => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForMyJobs())
    let link = "/job/myjobs"
    const jobs_db_response = await axios.get(link, { withCredentials: true })
    dispatch(jobSlice.actions.successForMyJobs(jobs_db_response.data.data))
  } catch (err) {
    if (err.request) {
      console.log("cannot send request")
      dispatch(jobSlice.actions.failureForMyJobs("failed to send request"))
    }
    dispatch(jobSlice.actions.failureForMyJobs(err?.response?.data?.message))
    console.log("jobSlice:: fetchjob error:response ", err)
  }
  dispatch(jobSlice.actions.clearAllError())
}

export const postJob = (data) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForPostJob())
    let link = "/job/newjob"
    const jobs_db_response = await axios.post(link, data, { withCredentials: true })
    dispatch(jobSlice.actions.successForPostJob())
  } catch (err) {
    if (err.request) {
      console.log("cannot send request")
      dispatch(jobSlice.actions.failureForPostJob("failed to send request"))
    }
    dispatch(jobSlice.actions.failureForPostJob(err?.response?.data?.message))
    console.log("jobSlice:: fetchjob error:response ", err)
  }
}

export const deleteJob = (data) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForAllJobs())
    const server_response = await axios.delete(`/job/${data}`, { withCredentials: true })
    dispatch(jobSlice.actions.successForDeleteJob(server_response.data.message))
  } catch (err) {
    if (err.request) {
      console.log("cannot send request")
      dispatch(jobSlice.actions.failureForPostJob("failed to send request"))
    }
    dispatch(jobSlice.actions.failureForPostJob(err?.response?.data?.message))
    console.log("jobSlice:: fetchjob error:response ", err)
  }
}

export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllError())
}

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice())
}

export default jobSlice.reducer
