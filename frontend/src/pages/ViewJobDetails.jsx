import React, { useEffect, useState } from "react"
import JobDetails from "../components/JobDetails"
import { useParams, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { fetchSingleJob } from "../store/slices/jobSlices"
export const ViewJobDetails = () => {
  const { jobId } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchSingleJob(jobId))
  }, [])

  return (
    <>
      <artical className="view_job_details">
        <h2 style={{ fontWeight: "bolder", textAlign: "center", padding: "10px" }}>Job Details</h2>
        <JobDetails className="job_details" />
        <Link
          to="/jobs"
          className="btn">
          Go back
        </Link>
      </artical>
    </>
  )
}
