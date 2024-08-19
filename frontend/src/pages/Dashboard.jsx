import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { logOut, clearAllUserErrors } from "../store/slices/userSlice"
import { LuMoveRight } from "react-icons/lu"
import MyProfile from "../components/MyProfile"
import UpdateProfile from "../components/UpdateProfile"
import UpdatePassword from "../components/UpdatePassword"
import MyJobs from "../components/MyJobs"
import JobPost from "../components/JobPost"
import Applications from "../components/Applications"
import MyApplications from "../components/MyApplications"
import { FiLogOut } from "react-icons/fi"

const Dashboard = () => {
  const [show, setShow] = useState(false)
  const [componentName, setComponentName] = useState("My Profile")

  const { loading, isAuthenticated, error, user } = useSelector((state) => state.users)
  console.log(user)
  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const handleLogout = () => {
    dispatch(logOut())
    toast.success("Logged out successfully.")
  }
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllUserErrors())
    }
    if (!isAuthenticated) {
      navigateTo("/")
    }
  }, [dispatch, error, loading, isAuthenticated, user])

  return (
    <>
      <section className="account">
        <div className="component_header">
          <h2 style={{ fontWeight: "bolder", fontSize: "1.5rem", textAlign: "center" }}>Dashboard</h2>
          <p>
            Welcome! <span>{user && user.name}</span>
          </p>
        </div>
        <div className="container sticky-parent">
          <div className={show ? "sidebar showSidebar sticky" : "sidebar sticky"}>
            <ul className="sidebar_links">
              <h4>Manage Account</h4>
              <li>
                <button
                  onClick={() => {
                    setComponentName("My Profile")
                    setShow(!show)
                  }}
                  style={{ cursor: "pointer" }}>
                  My Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setComponentName("Update Profile")
                    setShow(!show)
                  }}
                  style={{ cursor: "pointer" }}>
                  Update Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setComponentName("Update Password")
                    setShow(!show)
                  }}
                  style={{ cursor: "pointer" }}>
                  Update Password
                </button>
              </li>

              {user && user.role === "Employer" && (
                <li>
                  <button
                    onClick={() => {
                      setComponentName("Job Post")
                      setShow(!show)
                    }}
                    style={{ cursor: "pointer" }}>
                    Post New Job
                  </button>
                </li>
              )}
              {user && user.role === "Employer" && (
                <li>
                  <button
                    onClick={() => {
                      setComponentName("My Jobs")
                      setShow(!show)
                    }}
                    style={{ cursor: "pointer" }}>
                    My Jobs
                  </button>
                </li>
              )}
              {user && user.role === "Employer" && (
                <li>
                  <button
                    onClick={() => {
                      setComponentName("Applications")
                      setShow(!show)
                    }}
                    style={{ cursor: "pointer" }}>
                    Applications
                  </button>
                </li>
              )}
              {user && user.role === "Job Seeker" && (
                <li>
                  <button
                    onClick={() => {
                      setComponentName("My Applications")
                      setShow(!show)
                    }}
                    style={{ cursor: "pointer" }}>
                    My Applications
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}>
                  Logout<span> </span>
                  <FiLogOut />
                </button>
              </li>
            </ul>
          </div>
          <div className="banner">
            <div className={show ? "sidebar_icon move_right" : "sidebar_icon move_left"}>
              <LuMoveRight
                onClick={() => setShow(!show)}
                className={show ? "left_arrow" : "right_arrow"}
              />
            </div>
            {(() => {
              switch (componentName) {
                case "My Profile":
                  return <MyProfile />
                  break
                case "Update Profile":
                  return <UpdateProfile />
                  break
                case "Update Password":
                  return <UpdatePassword />
                  break
                case "Job Post":
                  return <JobPost />
                  break
                case "My Jobs":
                  return <MyJobs />
                  break
                case "Applications":
                  return <Applications />
                  break
                case "My Applications":
                  return <MyApplications />
                  break

                default:
                  ;<MyProfile />
                  break
              }
            })()}
          </div>
        </div>
      </section>
    </>
  )
}

export default Dashboard
