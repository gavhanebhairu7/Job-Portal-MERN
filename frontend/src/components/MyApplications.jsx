import React, { useEffect } from "react"
import { clearAllAppErrors, getSeekerApplications, resetAppSlice } from "../store/slices/applicationSlice"
import { useDispatch, useSelector, useStore } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Spinner from "./Spinner"
import { deleteSeekerApplication } from "../store/slices/applicationSlice"
import { toast } from "react-toastify"
const MyApplications = () => {
  const { myApplications, loading, error, message } = useSelector((state) => state.applications)
  const dispatch = useDispatch()
  console.log(myApplications)

  useEffect(() => {
    dispatch(getSeekerApplications())
    dispatch(clearAllAppErrors())
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllAppErrors())
      return
    }
    if (message) {
      toast.success(message)
      dispatch(resetAppSlice())
      dispatch(getSeekerApplications())
    }
  }, [dispatch, error, message])

  const handleDeleteApplication = (id) => {
    dispatch(deleteSeekerApplication(id))
  }
  return (
    <>
      {loading ? (
        <Spinner />
      ) : myApplications && myApplications.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>You have not applied for any job.</h1>
      ) : (
        <>
          <div className="account_components">
            <h3>My Application For Jobs</h3>
            <div className="applications_container">
              {myApplications.map((element) => {
                return (
                  <div
                    className="card"
                    key={element._id}>
                    <p className="sub-sec">
                      <span>Job Title: </span> {element.jobInfo.jobTitle}
                    </p>
                    <p className="sub-sec">
                      <span>Job Id:</span> {element.jobInfo.jobId}
                    </p>
                    <p className="sub-sec">
                      <span>Name</span> {element.applicantInfo.name}
                    </p>
                    <p className="sub-sec">
                      <span>Email</span> {element.applicantInfo.email}
                    </p>
                    <p className="sub-sec">
                      <span>Phone: </span> {element.applicantInfo.phone}
                    </p>
                    <p className="sub-sec">
                      <span>Address: </span> {element.applicantInfo.address}
                    </p>
                    <p className="sub-sec">
                      <span>Coverletter: </span>
                      <textarea
                        value={element.applicantInfo.coverLetter}
                        rows={5}
                        disabled></textarea>
                    </p>
                    <div className="btn-wrapper">
                      <button
                        className="outline_btn"
                        onClick={() => handleDeleteApplication(element._id)}>
                        Delete Application
                      </button>
                      <Link
                        to={element.applicantInfo && element.applicantInfo.resume.url}
                        className="btn"
                        target="_blank">
                        View Resume
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MyApplications
