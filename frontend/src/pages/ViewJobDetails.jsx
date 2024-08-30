import React, { useDebugValue, useEffect, useState } from "react"
import JobDetails from "../components/JobDetails"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { clearAllJobErrors, fetchSingleJob } from "../store/slices/jobSlices"
import Spinner from "../components/Spinner"
import { toast } from "react-toastify"
export const ViewJobDetails = () => {
  const { jobId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { error } = useSelector((state) => state.jobs)
  console.log(loading)
  useEffect(() => {
    dispatch(fetchSingleJob(jobId))
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllJobErrors())

      setTimeout(() => {
        setLoading(false)
        navigate("/login")
      }, 1500)
    }
  }, [error])

  return (
    <>
      {loading && <Spinner />}
      <article className="view_job_details">
        <h2 style={{ fontWeight: "bolder", textAlign: "center", padding: "10px" }}>Job Details</h2>
        <JobDetails className="job_details" />
        <Link
          to="/jobs"
          className="btn">
          Go back
        </Link>
      </article>
    </>
  )
}
