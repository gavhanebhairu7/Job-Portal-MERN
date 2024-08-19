import React, { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { Jobs } from "./pages/Jobs"
import Dashboard from "./pages/Dashboard"
import { PostApplication } from "./pages/PostApplication"
import { Register } from "./pages/Register"
import { Login } from "./pages/Login"
import { NotFound } from "./pages/NotFound"
import { Footer } from "./components/Footer"
import { Navbar } from "./components/Navbar"
import { ViewJobDetails } from "./pages/ViewJobDetails"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { clearAllUserErrors, fetchUser } from "./store/slices/userSlice"
import { useDispatch, useSelector } from "react-redux"
const App = () => {
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state.users)
  useEffect(() => {
    dispatch(fetchUser())
    // if (error) {
    //   toast.error("session expired !")
    //   dispatch(clearAllUserErrors())
    // }
  }, [])

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/jobs"
            element={<Jobs />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/post/application/:jobId"
            element={<PostApplication />}
          />
          <Route
            path="post/application/job/:jobId"
            element={<ViewJobDetails />}></Route>
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/*"
            element={<NotFound />}
          />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          theme="colored"
        />
      </Router>
    </>
  )
}

export default App
