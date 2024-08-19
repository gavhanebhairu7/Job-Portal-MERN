import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Spinner from "./Spinner"
import { Link, useNavigate } from "react-router-dom"
import { clearAllAppErrors, getEmployerApplication, replyEmployerApplication, resetAppSlice } from "../store/slices/applicationSlice"
import { toast } from "react-toastify"

const Applications = () => {
  const [disable, setDisable] = useState(false)
  const [filterBy, setFilterBy] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myApplications, error, message, loading } = useSelector((state) => state.applications)

  useEffect(() => {
    dispatch(getEmployerApplication())
    // dispatch(getEmployerApplication(filterBy))
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllAppErrors())
      setDisable(false)
    }
    if (message) {
      toast.success(message)
      dispatch(resetAppSlice())
      setDisable(false)
    }
    //navigate if needed
  }, [dispatch, error, message])

  const handleReply = (id, data) => {
    //handle logic here
    setDisable(true)
    dispatch(replyEmployerApplication(id, data))
  }
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="account_components">
            <h3>Applications For Your Posted Jobs</h3>
            <div className="applications_container">
              <div className="filter">
                <label htmlFor="filter">Filter Applications</label>
                <select
                  id="filter"
                  onChange={(e) => setFilterBy(e.target.value)}>
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              {myApplications && myApplications.length <= 0 ? (
                <h1>No {filterBy !== "All" ? filterBy : null} Applications.</h1>
              ) : (
                myApplications.map((element) => {
                  return (
                    <>
                      {filterBy === "" || filterBy === element.status ? (
                        <div
                          className="card"
                          style={{ padding: "40px" }}
                          key={element._id}>
                          <p className="sub-sec">
                            <span>Job Title: </span> {element.jobInfo.jobTitle}
                          </p>
                          <p className="sub-sec">
                            <span>Applicant's Name: </span> {element.applicantInfo.name}
                          </p>
                          <p className="sub-sec">
                            <span>Applicant's Email:</span> {element.applicantInfo.email}
                          </p>
                          <p className="sub-sec">
                            <span>Applicant's Phone: </span> {element.applicantInfo.phone}
                          </p>
                          <p className="sub-sec">
                            <span>Applicant's Address: </span> {element.applicantInfo.address}
                          </p>
                          <p className="sub-sec">
                            <span>Applicant's CoverLetter: </span>
                            <textarea
                              value={element.applicantInfo.coverLetter}
                              rows={5}
                              disabled></textarea>
                          </p>
                          <div className="btn-wrapper">
                            <button
                              className="outline_btn"
                              style={{ borderColor: "green", color: "green" }}
                              onClick={() => handleReply(element._id, "approve")}
                              disabled={disable || element.status === "Approved"}>
                              Approve
                            </button>
                            <button
                              className="outline_btn"
                              style={{ borderColor: "red", color: "red" }}
                              onClick={() => handleReply(element._id, "reject")}
                              disabled={disable || element.status === "Rejected"}>
                              Reject
                            </button>
                            <Link
                              to={element.applicantInfo && element.applicantInfo?.resume?.url}
                              className="btn"
                              target="_blank">
                              View Resume
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Applications
