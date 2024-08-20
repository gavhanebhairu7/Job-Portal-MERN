import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { clearAllJobErrors, fetchJob, selectSortedJobs } from "../store/slices/jobSlices"
import Spinner from "../components/Spinner"
import { FaSearch } from "react-icons/fa"
import { MdOutlineSort } from "react-icons/md"
import { Link } from "react-router-dom"

export const Jobs = () => {
  const [niche, setNiche] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("")
  const [city, setCity] = useState("")
  const [selectedCities, setSelectedCities] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [sortBy, setSortBy] = useState("")
  const { error, loading, job, niches, cities } = useSelector((state) => state.jobs)
  const dispatch = useDispatch()

  const handleCityChange = (city) => {
    setCity(city)
    setSelectedCities(city)
    console.log("changes ciy: ", city)
  }
  const handleNicheChange = (niche) => {
    setNiche(niche)
    setSelectedNiche(niche)
  }

  const resetFilter = () => {
    setCity(""), setSelectedCities(""), setNiche(""), setSelectedNiche("")
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      console.logO(error)
      dispatch(clearAllJobErrors())
    }
    dispatch(fetchJob(city, niche, searchKeyword))
  }, [dispatch, niche, city, error])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(fetchJob(city, niche, searchKeyword))
  }

  const handleSort = (criteria) => {
    setSortBy(criteria)
    dispatch(selectSortedJobs(criteria))
  }

  return (
    <>
      {loading && <Spinner />}
      <section className="jobs">
        <form className="search-tab-wrapper">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="What job are you looking for?"
          />
          <button
            type="submit"
            onClick={(e) => handleSearch(e)}
            style={{ cursor: "pointer" }}>
            Find Jobs
          </button>
          <FaSearch />
        </form>
        <div className="wrapper">
          <div className="filter-bar">
            <div className="cities">
              <div className="sort-container">
                <div style={{ color: "black" }}>
                  <MdOutlineSort />
                  Sort By:
                </div>
                <select
                  name="sort"
                  id="sort"
                  value={sortBy}
                  className="sort-button"
                  style={{ color: "blue" }}
                  onChange={(e) => handleSort(e.target.value)}>
                  <option value="default">default</option>
                  <option value="salary">salary</option>
                  <option value="position">positions</option>
                  <option value="posted-latest">posted-latest</option>
                  <option value="posted-earliest">posted-earliest</option>
                </select>
              </div>

              <button
                style={{ cursor: "pointer", borderRadius: "5px", backgroundColor: "turquoise", border: "solid turquoise" }}
                onClick={resetFilter}>
                reset filters
              </button>
              <h2>filter by Job roles</h2>
              {niches.map((el, ind) => {
                return (
                  <div key={ind}>
                    <input
                      type="radio"
                      value={el}
                      name="niches"
                      id={el}
                      onChange={() => handleNicheChange(el)}
                      checked={el === selectedNiche}></input>
                    <label htmlFor={el}>{el}</label>
                  </div>
                )
              })}
            </div>
            <div className="cities">
              <h2>filter by city</h2>
              {cities.map((el, ind) => {
                return (
                  <div key={ind}>
                    <input
                      type="radio"
                      value={el}
                      name="city"
                      id={el}
                      onChange={() => handleCityChange(el)}
                      checked={el === selectedCities}></input>
                    <label htmlFor={el}>{el}</label>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="container">
            <div className="mobile-filter">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}>
                <option>filter by city</option>
                {cities.map((ele, ind) => (
                  <option
                    key={ind}
                    value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}>
                <option>filter by role</option>
                {niches.map((ele, ind) => (
                  <option
                    key={ind}
                    value={ele}>
                    {ele}
                  </option>
                ))}
              </select>

              <div className="sort-container">
                <div style={{ color: "black" }}>
                  <MdOutlineSort />
                  Sort By:
                </div>
                <select
                  name="sort"
                  id="sort"
                  value={sortBy}
                  className="sort-button"
                  style={{ color: "blue" }}
                  onChange={(e) => handleSort(e.target.value)}>
                  <option value="default">default</option>
                  <option value="salary">salary</option>
                  <option value="position">positions</option>
                  <option value="posted-latest">posted-latest</option>
                  <option value="posted-earliest">posted-earliest</option>
                </select>
              </div>
            </div>
            <div className="jobs_container">
              {job &&
                job.map((ele) => {
                  return (
                    <div
                      className="card"
                      key={ele._id}>
                      {ele.positions && ele.positions >= 2 ? (
                        <p className="hiring-multiple">Positions - {ele.positions}</p>
                      ) : ele.positions == -1 ? (
                        <p className="hiring">positions - unavailable</p>
                      ) : (
                        <p className="hiring">Positions - {ele.positions}</p>
                      )}
                      <p className="title">{ele.title}</p>
                      <p className="company">{ele.companyName}</p>
                      <p className="location">{ele.location}</p>
                      <p className="salary">
                        <span>CTC(annual) {ele.salary}</span>
                      </p>
                      <p className="location">
                        <span>Posted on </span>
                        {ele.jobPostedOn.substring(0, 10)}
                      </p>
                      <div className="btn-wrapper">
                        <Link
                          to={`/post/application/job/${ele._id}`}
                          className="outline_btn">
                          view Details
                        </Link>
                        <Link
                          className="btn"
                          to={`/post/application/${ele._id}`}>
                          Apply now
                        </Link>
                      </div>
                    </div>
                  )
                })}
              {job.length === 0 && <p className="location">No result found !</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
