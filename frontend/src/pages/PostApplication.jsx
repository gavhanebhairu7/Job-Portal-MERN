import React, { useEffect, useState } from "react"
import JobDetails from "../components/JobDetails"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchSingleJob } from "../store/slices/jobSlices"
import { Link } from "react-router-dom"
import { clearAllAppErrors, postApplication, resetAppSlice } from "../store/slices/applicationSlice"
import { toast } from "react-toastify"
export const PostApplication = () => {
  const { user, isAuthenticated } = useSelector((state) => state.users)
  const { error, message, loading } = useSelector((state) => state.applications)
  const [resume, setResume] = useState(user?.resume?.url)
  const [email, setEmail] = useState(user?.email)
  const [name, setName] = useState(user?.name)
  const [address, setAddress] = useState(user?.address)
  const [phone, setPhone] = useState(user?.phone)
  const [coverLetter, setCoverLetter] = useState(user?.coverLetter)
  const [uploaded, setUploaded] = useState(false)

  const { jobId } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchSingleJob(jobId))
  }, [])

  const handleResume = (e) => {
    setResume(e.target.files[0])
    setUploaded(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("address", address)
    formData.append("phone", phone)
    formData.append("coverLetter", coverLetter)
    if (resume?.name) {
      formData.append("resume", resume)
    }
    dispatch(postApplication(jobId, formData))
  }
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("isauthentic: ", isAuthenticated)
      toast.error("You are not authenticated, kindly login first !")
      navigate("/login")
      return
    }
    if (error) {
      toast.error(error)
      dispatch(clearAllAppErrors())
    }
    if (message) {
      toast.success(message)
      dispatch(resetAppSlice())
      navigate("/jobs")
    }
  }, [isAuthenticated, error, message, loading])

  return (
    <>
      <artical className="application_page">
        <form
          className="view_job_details"
          style={{ alignItems: "stretch" }}>
          <h2 style={{ fontWeight: "bolder", textAlign: "center", padding: "10px" }}>Application Form</h2>
          <div>
            <label>Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Your Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label>Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
            />
          </div>
          {!uploaded && resume && (
            <div>
              Your Resume
              <Link
                to={resume}
                target="_blank"
                className="outline_btn">
                click to view
              </Link>
            </div>
          )}
          <div>
            <label>Resume</label>
            <input
              className="outline_btn"
              type="file"
              onChange={handleResume}
              rows={4}
            />
          </div>
          <div>
            <button
              className="btn"
              type="submit"
              onClick={handleSubmit}>
              Save and Apply
            </button>
          </div>
        </form>
        <div className="view_job_details">
          <h2 style={{ fontWeight: "bolder", textAlign: "center", padding: "10px" }}>Job Details</h2>
          <JobDetails className="job_details" />
        </div>
      </artical>
    </>
  )
}
