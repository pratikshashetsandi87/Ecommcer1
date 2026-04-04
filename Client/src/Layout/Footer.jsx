import React from 'react'
import { Link } from 'react-router-dom'
import '../Style/Footer.css'

function Footer() {
  return (
    <div className="footer bg-dark">
      <h6 className="text-center">© 2024 Company</h6>
      <p className="text-center ">
        <Link to="/about" className="text-light">About</Link> | 
        <Link to="/contact" className="text-light">Contact</Link> | 
        <Link to="/policy" className="text-light">Privacy Policy</Link>
      </p>
    </div>
  )
}

export default Footer
