import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const appSlice = createSlice({
  name: "applications",
  initialState: {
    application: [],
    loading: null,
    error: null,
    message: null,
    myApplications: [],
  },
  reducers: {
    //posting new application
    postAapplicationRequest(state, action) {
      state.loading = true
    },
    postAapplicationSuccess(state, action) {
      state.loading = false
      state.myApplications.push(action.payload.data)
      state.message = action.payload.message
      console.log("message set", state.message)
    },
    postAapplicationFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    //getting Job seeker applications
    getSeekerApplicationRequest(state, action) {
      state.loading = true
    },
    getSeekerApplicationSuccess(state, action) {
      state.loading = false
      console.log("action: ", action.payload.data)
      state.myApplications = [...action.payload.data]
      console.log(state.myApplications)
      // state.message = action.payload.message
    },
    getSeekerApplicationFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    //get employer applications for specific job
    getEmployerApplicationRequest(state, action) {
      state.loading = true
    },
    getEmployerApplicationSuccess(state, action) {
      state.loading = false
      console.log("action: ", action.payload.data)
      state.myApplications = [...action.payload.data]
    },
    getEmployerApplicationFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    //reducer for replying application: Employer(approval or reject)
    replyApplicationRequest(state, action) {
      state.loading = true
    },
    replyApplicationSuccess(state, action) {
      state.loading = false
      state.message = action.payload.message
      const updatedApplication = action.payload.data
      state.myApplications.forEach((element) => {
        if (element._id === updatedApplication._id) {
          element.status = updatedApplication.status
          console.log("status updated in local storage")
        }
      })
    },
    replyApplicationFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    deleteSeekerApplicationRequest(state, action) {
      state.loading = true
    },
    deleteSeekerApplicationSuccess(state, action) {
      state.loading = false
      state.message = action.payload
    },
    deleteSeekerApplicationFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    clearAllApplicationErrors(state, action) {
      state.error = null
    },
    resetApplicationSlice(state, action) {
      state.error = null
      state.message = null
      state.loading = false
    },
  },
})

export const postApplication = (id, data) => async (dispatch) => {
  dispatch(appSlice.actions.postAapplicationRequest)
  try {
    const server_response = await axios.post(`application/apply/${id}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    })
    console.log("post application server response: ", server_response)
    dispatch(appSlice.actions.postAapplicationSuccess(server_response.data))
  } catch (err) {
    if (err.message === "Network Error") {
      dispatch(appSlice.actions.postAapplicationFailure("Network Error"))
      return
    }
    console.log(err)
    dispatch(appSlice.actions.postAapplicationFailure(err?.response?.data?.message))
  }
}

export const getEmployerApplication =
  (status = null, id = null) =>
  async (dispatch) => {
    dispatch(appSlice.actions.getEmployerApplicationRequest)
    try {
      let link = "/emp/applications?"
      let queryParams = []
      if (status) queryParams.push(`status=${status}`)
      if (id) queryParams.push(`jobId=${id}`)
      link += queryParams.join("&")
      const server_response = await axios.get(link, {
        withCredentials: true,
      })
      console.log("get Employer application server response: ", server_response)
      dispatch(appSlice.actions.getEmployerApplicationSuccess(server_response.data))
    } catch (err) {
      if (err.message === "Network Error") {
        dispatch(appSlice.actions.getEmployerApplicationFailure("Network Error"))
        return
      }
      dispatch(appSlice.actions.getEmployerApplicationFailure(err.response.data.message))
    }
  }

export const replyEmployerApplication =
  (id = null, status = null) =>
  async (dispatch) => {
    dispatch(appSlice.actions.replyApplicationRequest())
    try {
      if (!id) {
        return
      }
      let link = `/${id}?`
      if (status === "approve") link += `approve=true`
      else if (status === "reject") link += "approve=false"

      const server_response = await axios.put(
        link,
        {},
        {
          withCredentials: true,
        }
      )
      console.log("get Employer application server response: ", server_response)
      dispatch(appSlice.actions.replyApplicationSuccess(server_response.data))
    } catch (err) {
      if (err.message === "Network Error") {
        dispatch(appSlice.actions.replyApplicationFailure("Network Error"))
        return
      }
      dispatch(appSlice.actions.replyApplicationFailure(err.response.data.message))
    }
  }

export const getSeekerApplications = () => async (dispatch) => {
  dispatch(appSlice.actions.getSeekerApplicationRequest)
  try {
    let link = "/myapplications"
    const server_response = await axios.get(link, {
      withCredentials: true,
    })
    console.log("get JobSeeker application server response: ", server_response)
    dispatch(appSlice.actions.getSeekerApplicationSuccess(server_response.data))
  } catch (err) {
    if (err.message === "Network Error") {
      dispatch(appSlice.actions.getSeekerApplicationFailure("Network Error"))
      return
    }
    console.log("error : ", err)
    dispatch(appSlice.actions.getSeekerApplicationFailure(err.response.data.message))
  }
}

export const deleteSeekerApplication = (appId) => async (dispatch) => {
  dispatch(appSlice.actions.deleteSeekerApplicationRequest)
  try {
    let link = `/${appId}`
    const server_response = await axios.delete(link, {
      withCredentials: true,
    })
    dispatch(appSlice.actions.deleteSeekerApplicationSuccess(server_response.data.message))
  } catch (err) {
    if (err.message === "Network Error") {
      dispatch(appSlice.actions.getSeekerApplicationFailure("Network Error"))
      return
    }
    console.log("error : ", err)
    dispatch(appSlice.actions.getSeekerApplicationFailure(err?.response?.data?.message))
  }
}

export const clearAllAppErrors = () => (dispatch) => {
  dispatch(appSlice.actions.clearAllApplicationErrors())
}

export const resetAppSlice = () => (dispatch) => {
  dispatch(appSlice.actions.resetApplicationSlice())
}

export default appSlice.reducer
