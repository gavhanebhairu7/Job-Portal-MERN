import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { GiHamburgerMenu } from "react-icons/gi"
import logoImage from "../assets/png/logo-no-background.png"
export const Navbar = () => {
  const [show, setShow] = useState()
  const { isAuthenticated } = useSelector((state) => state.users)
  const linkStyle = {
    color: "orange",
  }
  return (
    <>
      <nav className={show ? "navbar show_navbar" : "navbar"}>
        <div className="logo">
          <img
            src={logoImage}
            alt="logo icon"
            width={"10px"}
          />
        </div>
        <div className="links">
          <ul style={linkStyle}>
            <li>
              <Link
                to={"/"}
                onClick={() => setShow(!show)}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to={"/jobs"}
                onClick={() => setShow(!show)}>
                Jobs
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link
                  to={"/dashboard"}
                  onClick={() => setShow(!show)}>
                  Dashboard
                </Link>
              </li>
            ) : (
              <li>
                <Link to={"/login"}>Login</Link>
              </li>
            )}
          </ul>
        </div>
        <GiHamburgerMenu
          className="hamburger"
          onClick={() => setShow(!show)}
        />
      </nav>
    </>
  )
}
