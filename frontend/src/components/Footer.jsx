import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import logoImage from "../assets/png/logo-no-background.png"
import { FaSquareXTwitter, FaSquareInstagram, FaLinkedin, FaFacebook } from "react-icons/fa6"
export const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.users)
  return (
    <footer>
      <div className="logo">
        <img
          src={logoImage}
          alt="logo image"
        />
      </div>
      <div>
        <h4>Support</h4>
        <ul>
          <li>Career craft technologies, Katraj, pune</li>
          <li>support@careercraft.com</li>
          <li>+91 7439549292</li>
        </ul>
      </div>
      <div>
        <h4>Quick links</h4>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jobs">Jobs</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>
      </div>

      <div>
        <h4>Follow us</h4>
        <ul>
          <li>
            <Link>
              <span>
                <FaSquareXTwitter />
              </span>
              <span>twitter</span>
            </Link>
          </li>
          <li>
            <Link>
              <span>
                <FaSquareInstagram />
              </span>
              <span>instagram</span>
            </Link>
          </li>
          <li>
            <Link>
              <span>
                <FaFacebook />
              </span>
              <span>facebook</span>
            </Link>
          </li>
          <li>
            <Link>
              <span>
                <FaLinkedin />
              </span>
              <span>linked In</span>
            </Link>
          </li>
        </ul>
      </div>
      <div
        className="copyright"
        style={{ flexDirection: "column" }}>
        <div>&copy; {new Date().getFullYear()} All rights reserved By Developers</div>

        <p>Developed with ❤️ by Bhairav</p>
      </div>
    </footer>
  )
}
