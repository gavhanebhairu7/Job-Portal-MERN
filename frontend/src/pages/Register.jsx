import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearAllUserErrors, register } from "../store/slices/userSlice"
import { toast } from "react-toastify"
import { clearAllJobErrors } from "../store/slices/jobSlices"
import { Link } from "react-router-dom"

import { FaRegUser } from "react-icons/fa6"
import { MdDriveFileRenameOutline } from "react-icons/md"
import { MdOutlineAttachEmail } from "react-icons/md"
import Spinner from "../components/Spinner"
import { FaAddressCard, FaIdCard, FaLaptopCode, FaLock, FaPhone } from "react-icons/fa"
import { GrContactInfo } from "react-icons/gr"

export const Register = () => {
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [firstNiche, setFirstNiche] = useState("")
  const [secondNiche, setSecondNiche] = useState("")
  const [thirdNiche, setThirdNiche] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState(null)
  const [resume, setResume] = useState(null)
  const niches = ["Web development", "Android development", "Software developer", "Frontend developer", "Backend developer"]
  const { user, loading, error, isAuthenticated, message } = useSelector((state) => state.users)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleResume = (e) => {
    const file = e.target.files[0]
    console.log("file", file)
    setResume(file)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast.error("password and confirm password not matching")
    }

    const formData = new FormData()
    formData.append("role", role)
    formData.append("name", name)
    formData.append("phone", phone)
    formData.append("address", address)
    formData.append("email", email.toLowerCase())
    formData.append("password", password)
    if (role === "Job Seeker") {
      formData.append("firstNiche", firstNiche)
      formData.append("secondNiche", secondNiche)
      formData.append("thirdNiche", thirdNiche)
      formData.append("coverLetter", coverLetter)
      formData.append("resume", resume)
    }
    dispatch(register(formData))
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      console.log("error is toasted")
      dispatch(clearAllUserErrors())
    }
    if (isAuthenticated) {
      toast.success("Congratulations!, registered successfully")
      navigate("/")
    }
  }, [error, dispatch, isAuthenticated, message, loading])

  return (
    <>
      {loading && <Spinner />}
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>create new Account</h3>
          </div>
          <form onSubmit={handleRegister}>
            <div className="wrapper">
              <div className="inputTag">
                <label>Register As</label>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}>
                    <option value="none">Select Role</option>
                    <option value="Employer">Employer</option>
                    <option value="Job Seeker">Job Seeker</option>
                  </select>
                  <FaRegUser />
                </div>
                {/* icon here */}
              </div>

              <div className="inputTag">
                <label>Name</label>
                <div>
                  <input
                    type="text"
                    placeholder="Your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <MdDriveFileRenameOutline />
                </div>
                {/* icon here */}
              </div>
            </div>
            <div className="wrapper">
              <div className="inputTag">
                <label>Phone</label>
                <div>
                  <input
                    type="number"
                    placeholder="1112223334"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <FaPhone />
                </div>
                {/* icon here */}
              </div>

              <div className="inputTag">
                <label>Email</label>
                <div>
                  <input
                    type="text"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <MdOutlineAttachEmail />
                </div>
              </div>
            </div>

            <div className="wrapper">
              <div className="inputTag">
                <label>Address</label>
                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Your address here.."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <FaAddressCard />
                </div>
                {/* icon here */}
              </div>

              <div className="inputTag">
                <label>Password</label>
                <div>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FaLock />
                </div>
                {/* icon here */}
              </div>
              <div className="inputTag">
                <label>Confirm Password</label>
                <div>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    name=""
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <FaLock />
                </div>
                {/* icon here */}
              </div>
            </div>

            {role === "Job Seeker" ? (
              <>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>first Niche</label>
                    <div>
                      <select
                        value={firstNiche}
                        onChange={(e) => setFirstNiche(e.target.value)}>
                        <option value={null}>select first-preference</option>
                        {niches.map((niche, index) => {
                          return (
                            <option
                              value={niche}
                              key={index}>
                              {niche}
                            </option>
                          )
                        })}
                      </select>
                      <FaLaptopCode />
                    </div>
                  </div>

                  <div className="inputTag">
                    <label>second Niche</label>
                    <div>
                      <select
                        value={secondNiche}
                        onChange={(e) => setSecondNiche(e.target.value)}>
                        <option value={null}>select second-preference</option>
                        {niches.map((niche, index) => {
                          return niche !== firstNiche ? (
                            <option
                              value={niche}
                              key={index}>
                              {niche}
                            </option>
                          ) : null
                        })}
                      </select>
                      <FaLaptopCode />
                    </div>
                  </div>

                  <div className="inputTag">
                    <label>third Niche</label>
                    <div>
                      <select
                        value={thirdNiche}
                        onChange={(e) => setThirdNiche(e.target.value)}>
                        <option value={null}>select third-preference</option>
                        {niches.map((niche, index) => {
                          return niche !== firstNiche && niche !== secondNiche ? (
                            <option
                              value={niche}
                              key={index}>
                              {niche}
                            </option>
                          ) : null
                        })}
                      </select>
                      <FaLaptopCode />
                    </div>
                  </div>
                </div>

                <div className="wrapper">
                  <div className="inputTag">
                    <label>cover letter</label>
                    <div>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}></textarea>
                    </div>
                  </div>

                  <div className="inputTag">
                    <label>resume</label>
                    <div>
                      <input
                        type="file"
                        name="resume"
                        onChange={handleResume}
                      />
                      <FaIdCard />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <button
                type="submit"
                style={{ width: "200px", cursor: "pointer" }}
                onClick={handleRegister}>
                submit
              </button>
              <Link
                to="/login"
                style={{ border: "none", fontStyle: "italic", fontWeight: "500", opacity: "0.7" }}>
                Already have account, Login here
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
