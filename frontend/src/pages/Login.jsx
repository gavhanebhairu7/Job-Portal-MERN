import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearAllUserErrors, register } from "../store/slices/userSlice"
import { toast } from "react-toastify"
import { clearAllJobErrors } from "../store/slices/jobSlices"
import { FaRegUser } from "react-icons/fa6"
import { MdOutlineAttachEmail } from "react-icons/md"
import Spinner from "../components/Spinner"
import { FaLock } from "react-icons/fa"
import { login } from "../store/slices/userSlice"
export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Job Seeker")
  const { error, user, loading, message, isAuthenticated } = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (error) {
      toast.error(error)
      console.log("error is being toasted")
      dispatch(clearAllUserErrors)
      return
    }
    if (message) {
      console.log("message: ", message)
    }
    if (isAuthenticated) {
      toast.success("login successful")
      navigate("/")
    }
  }, [error, dispatch, isAuthenticated, message, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    let data = { role, email: email.toLowerCase(), password }
    dispatch(login(data))
  }
  return (
    <>
      {loading && <Spinner />}
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Login</h3>
          </div>
          <form>
            <div
              className="wrapper"
              style={{ flexDirection: "column", alignItems: "center" }}>
              <div className="inputTag loginTag">
                <label>Register As</label>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}>
                    <option value="Employer">Employer</option>
                    <option value="Job Seeker">Job Seeker</option>
                  </select>
                  <FaRegUser className="ico" />
                </div>
                {/* icon here */}
              </div>

              <div className="inputTag loginTag">
                <label>Email</label>
                <div>
                  <input
                    type="text"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <MdOutlineAttachEmail className="ico" />
                </div>
              </div>

              <div className="inputTag loginTag">
                <label>Password</label>
                <div>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FaLock className="ico" />
                </div>
                {/* icon here */}
              </div>
            </div>
            <div
              className="wrapper"
              style={{ flexDirection: "column", alignItems: "center" }}>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn">
                Login
              </button>
              <Link
                to="/register"
                style={{ border: "none", fontStyle: "italic", marginTop: "0px", fontWeight: "500", opacity: "0.7" }}>
                don't have account, create one here
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
