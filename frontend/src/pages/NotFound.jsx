import React from "react"
import {Link} from 'react-router-dom'
export const NotFound = () => {
  return <div className="notfound" style={{minHeight:"50vh"}}>
    <div className="content" style={{minHeight:"50vh"}}>
      <h1>404 NOT FOUND</h1>
      <p>Your visited page not found !</p>
      <Link className="btn" to={`/`}>go back to Home</Link>
    </div>
  </div>
}
