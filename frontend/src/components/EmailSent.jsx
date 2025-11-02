// /pages/EmailSent.jsx

import React from 'react'
import { Link } from 'react-router-dom'

const EmailSent = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-orange-600 mb-2">Check your mail</h1>
        <p className="text-gray-600">We have sent a password recover instructions to your email.</p>
      </div>
      
      <div className="space-y-4">
        <Link to="https://gmail.com" className="w-full flex text-lg font-bold items-center justify-center gap-2 px-6 py-3 rounded-lg text-white  bg-orange-600 transform focus:outline-none focus:ring-2 focus:ring-offset-2 duration-200  hover:text-orange-600 hover:bg-orange-50 hover:outline-none hover:ring-2 hover:ring-orange-600 hover:border-transparent transition hover:cursor-pointer
            focus:ring-orange-300 ">
          Open email app
        </Link>
        
        <Link to="/" className="
        w-full flex text-md items-center justify-center
         bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
          Skip, I'll confirm later
        </Link>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Didn't receive the email? Check your spam filter or{' '}
          <Link to="/forgot-password" className="text-orange-600 hover:underline transition-all font-medium
          ">try another email address</Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default EmailSent
