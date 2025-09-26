import React from 'react'
import { Link } from 'react-router-dom'
const PageNotFound = () => {
  return (
    <>
    <div>404 Page Not Found</div>
    <Link to="/login">Back to Login</Link>
    </>

  )
}

export default PageNotFound