import React from "react"
import { useSelector } from "react-redux"
import { IoMdCash } from "react-icons/io"
import { FaToolbox } from "react-icons/fa"
import { FaLocationDot } from "react-icons/fa6"
import { Link } from "react-router-dom"
const JobDetails = () => {
  const { singleJob } = useSelector((state) => state.jobs)

  let qualifications = []
  let responsibilities = []
  let offering = []
  if (singleJob.qualifications) {
    qualifications = singleJob.qualifications.split(". ")
  }
  if (singleJob.responsibilities) {
    responsibilities = singleJob.responsibilities.split(". ")
  }
  if (singleJob.offers) {
    offering = singleJob.offers.split(". ")
  }

  return (
    <div className="job-details">
      <header>
        <h3>{singleJob.title}</h3>
        {/* //change here */}
        {singleJob.companyWebsite && (
          <Link
            target="_blank"
            to={singleJob?.personalWebsite?.url}>
            {singleJob?.personalWebsite?.title}
          </Link>
        )}
        <b style={{ fontWeight: "bold" }}>{singleJob.companyName}</b>
        <p>{singleJob.location}</p>
        <p>Rs. {singleJob?.salary} a month</p>
      </header>
      <hr />
      <section>
        <div className="wrapper">
          <h3>Job details</h3>
          <div>
            <div>
              <IoMdCash />
              <span> Pay </span>
              <span>{singleJob?.salary} a month</span>
            </div>
          </div>
          <div>
            <div>
              <FaToolbox />
              <span> Job type </span>
              <span>{singleJob.type}</span>
            </div>
          </div>
        </div>
        <hr />
        <div className="wrapper">
          <h3> Location </h3>
          <div className="location-wrapper">
            <FaLocationDot />
            <span> {singleJob.location}</span>
          </div>
        </div>
        <hr />
        <div className="wrapper">
          <h3>Full Job Description</h3>
          <p>{singleJob?.introduction}</p>
          {singleJob?.qualifications && (
            <div>
              <h4>Qualifications</h4>
              <ul>
                {qualifications.map((element) => {
                  return (
                    <li
                      key={element}
                      style={{ listStyle: "inside" }}>
                      {element}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {singleJob?.responsibilities && (
            <div>
              <h4>Responsibilities</h4>
              <ul>
                {responsibilities.map((element) => {
                  return (
                    <li
                      key={element}
                      style={{ listStyle: "inside" }}>
                      {element}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {singleJob?.offers && (
            <div>
              <h4>Offering</h4>
              <ul>
                {offering.map((element) => {
                  return (
                    <li
                      key={element}
                      style={{ listStyle: "inside" }}>
                      {element}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
      <hr />
      <footer style={{ backgroundColor: "transparent", display: "block" }}>
        <h3>Job Niche</h3>
        <p>{singleJob?.jobNiche}</p>
      </footer>
    </div>
  )
}

export default JobDetails
