import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { clearAllJobErrors, postJob, resetJobSlice } from "../store/slices/jobSlices"
import { CiCircleInfo } from "react-icons/ci"

const JobPost = () => {
  const [title, setTitle] = useState("")
  const [jobType, setJobType] = useState("")
  const [location, setLocation] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [introduction, setIntroduction] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [qualifications, setQualifications] = useState("")
  const [offers, setOffers] = useState("")
  const [jobNiche, setJobNiche] = useState("")
  const [salary, setSalary] = useState("")
  const [positions, setpositions] = useState("")
  const [companyWebsiteTitle, setcompanyWebsiteTitle] = useState("")
  const [companyWebsiteUrl, setcompanyWebsiteUrl] = useState("")

  const { isAuthenticated, user } = useSelector((state) => state.users)
  const { loading, error, message, niches, cities } = useSelector((state) => state.jobs)
  const dispatch = useDispatch()

  const handlePostJob = (e) => {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("type", jobType)
    formData.append("location", location)
    formData.append("companyName", companyName)
    formData.append("introduction", introduction)
    formData.append("responsibilities", responsibilities)
    formData.append("qualifications", qualifications)
    offers && formData.append("offers", offers)
    formData.append("jobNiche", jobNiche)
    formData.append("salary", salary)
    positions && formData.append("positions", positions)
    companyWebsiteTitle && formData.append("companyWebsiteTitle", companyWebsiteTitle)
    companyWebsiteUrl && formData.append("companyWebsiteUrl", companyWebsiteUrl)

    dispatch(postJob(formData))
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllJobErrors())
    }
    if (message) {
      toast.success(message)
      dispatch(resetJobSlice())
    }
  }, [dispatch, error, loading, message])

  return (
    <div className="account_components">
      <h3>Post A Job</h3>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job Title"
        />
      </div>
      <div>
        <label>Job Type</label>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}>
          <option value="">Select Job Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
        </select>
      </div>
      <div>
        <label>Location (City)</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Job Type</option>
          {cities.map((element) => {
            return <option value={element}>{element}</option>
          })}
        </select>
      </div>
      <div>
        <label>Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
        />
      </div>
      <div>
        <label>Company/Job Introduction</label>
        <textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="Company / Job Introduction"
          rows={7}
        />
      </div>
      <div>
        <label>Responsibilities</label>
        <textarea
          value={responsibilities}
          onChange={(e) => setResponsibilities(e.target.value)}
          placeholder="Job Responsibilities"
          rows={7}
        />
      </div>
      <div>
        <label>Qualifications</label>
        <textarea
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          placeholder="Required Qualifications For Job"
          rows={7}
        />
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>What We Offer</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
        <textarea
          value={offers}
          onChange={(e) => setOffers(e.target.value)}
          placeholder="What are we offering in return!"
          rows={7}
        />
      </div>
      <div>
        <label>Job Niche</label>
        <select
          value={jobNiche}
          onChange={(e) => setJobNiche(e.target.value)}>
          <option value="">Select Job Niche</option>
          {niches.map((element) => {
            return <option value={element}>{element}</option>
          })}
        </select>
      </div>
      <div>
        <label>Salary</label>
        <input
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="50000 - 800000"
        />
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>Hiring Multiple Candidates?</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
        <label>Number of positions</label>
        <input
          type="number"
          value={positions}
          onChange={(e) => setpositions(e.target.value)}
        />
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>Personal Website Name</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
        <input
          type="text"
          value={companyWebsiteTitle}
          onChange={(e) => setcompanyWebsiteTitle(e.target.value)}
          placeholder="Peronsal Website Name/Title"
        />
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>Personal Website Link (URL)</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
        <input
          type="text"
          value={companyWebsiteUrl}
          onChange={(e) => setcompanyWebsiteUrl(e.target.value)}
          placeholder="Peronsal Website Link (URL)"
        />
      </div>
      <div>
        <button
          style={{ margin: "0 auto" }}
          className="btn"
          onClick={handlePostJob}
          disabled={loading}>
          Post Job
        </button>
      </div>
    </div>
  )
}

export default JobPost
