import { createSlice } from "@reduxjs/toolkit"
import { FaPhone } from "react-icons/fa"
import axios from "axios"

let baseURL = import.meta.env.VITE_BASE_URL

axios.defaults.baseURL = `${baseURL}`

const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    isAuthenticated: true,
    user: {},
    error: null,
    message: null,
  },
  reducers: {
    registerRequest(state, action) {
      state.loading = true
      state.isAuthenticated = false
      state.user = {}
      state.error = null

      state.message = null
    },
    registerSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.data
      state.error = null
      state.message = action.payload.message
    },
    registerFailure(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.user = {}
      state.error = action.payload
      state.message = null
    },
    clearAllError(state, action) {
      state.user = state.user
      state.error = null
    },

    loginRequest(state, action) {
      state.loading = true
      state.isAuthenticated = false
      state.user = {}
      state.error = null
      state.message = null
    },
    loginSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.data
      state.error = null
      state.message = action.payload.message
    },
    loginFailure(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.user = {}
      state.error = action.payload
      state.message = null
    },

    // fetch reducers : to maintain authenticated status
    fetchRequest(state, action) {
      state.loading = true
      state.error = null
      state.message = null
    },
    fetchSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.data
      state.error = null
      state.message = action.payload.message
    },
    fetchFailure(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.user = {}
      state.message = null
    },

    logoutRequest(state, action) {
      state.loading = true
      state.error = null
      state.message = null
    },
    logoutSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.user = {}
      state.error = null
      state.message = action.payload.message
    },
    logoutFailure(state, action) {
      state.loading = false
      state.error = action.payload
      state.message = null
    },
  },
})

export const register = (data) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.registerRequest())
    const server_response = await axios.post("/user/register", data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    })

    dispatch(userSlice.actions.registerSuccess(server_response.data))
  } catch (err) {
    if (err.request) {
      dispatch(userSlice.actions.registerFailure("All fields are madatory"))
      return
    }
    dispatch(userSlice.actions.registerFailure(err.response.data.message))
    console.log("userSlice:: fetchjob error:response ", err)
  }
  // dispatch(userSlice.actions.clearAllError())
}

export const login = (data) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.loginRequest())
    const server_response = await axios.post("/user/login", data, {
      withCredentials: true,
    })
    dispatch(userSlice.actions.loginSuccess(server_response.data))
  } catch (err) {
    if (err.message === "Network Error") {
      console.log("cannot send request", err)
      dispatch(userSlice.actions.loginFailure("Network Errors"))
      return
    }
    dispatch(userSlice.actions.loginFailure(err.response.data.message))
    console.log("userSlice:: fetchjob error:response ", err)
  }
  // dispatch(userSlice.actions.clearAllError())
}

export const fetchUser = (data) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.fetchRequest())
    const server_response = await axios.get("/user/getuser", {
      withCredentials: true,
    })
    dispatch(userSlice.actions.fetchSuccess(server_response.data))
  } catch (err) {
    if (err.message === "Network Error") {
      console.log("cannot send request", err)
      dispatch(userSlice.actions.fetchFailure("Network error"))
      return
    }
    dispatch(userSlice.actions.fetchFailure(err.response.data.message))
    console.log("userSlice:: fetchjob error:response ", err)
  }
  // dispatch(userSlice.actions.clearAllError())
}

export const logOut = () => async (dispatch) => {
  try {
    dispatch(userSlice.actions.logoutRequest())
    const server_response = await axios.post("/user/logout", {}, { withCredentials: true })
    if (server_response.data.success) {
      dispatch(userSlice.actions.logoutSuccess(server_response.data))
    } else {
      dispatch(userSlice.actions.logoutFailure(server_response.data.message))
    }
  } catch (err) {
    if (err.message === "Network Error") {
      console.log("cannot send request", err)
      dispatch(userSlice.actions.logoutFailure("Network error"))
      return
    }
    dispatch(userSlice.actions.logoutFailure(err.response.data.message))
    console.log("userSlice:: logout error:response ", err)
  }
  // dispatch(userSlice.actions.clearAllError())
}

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllError())
}

export default userSlice.reducer
