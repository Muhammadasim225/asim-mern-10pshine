import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgetPassword } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
      const [email_address, setEmail] = useState("");
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate=useNavigate();

      const dispatch = useDispatch()

      const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
    
        if (!email) {
          setError('Please enter your email')
          return
        }
    
        setIsLoading(true)
    
        try {
          const actionResult = await dispatch(forgetPassword({ email_address }))
          if (forgetPassword.fulfilled.match(actionResult)) {
            navigate('/email-sent'); 
          } else {
            setError(typeof actionResult.payload === 'string' ? actionResult.payload : 'Failed to send reset link')
          }
        } catch (err) {
          setError(err.message || 'Something went wrong')
        } finally {
          setIsLoading(false)
        }
      }
    
  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
    {/* White Card */}
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="mt-6 text-3xl font-extrabold text-orange-600 mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-600">
            No worries, we'll send you reset notification.
        </p>
      </div>

      {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 font-semibold text-center">{success}</div>
        )}

      {/* Forgot Password Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email_address}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition"
            aria-label="Email address"
          />
        </div>
    
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex text-lg font-bold items-center justify-center gap-2 px-6 py-3 rounded-lg text-white  bg-orange-600 transform focus:outline-none focus:ring-2 
            
            focus:ring-offset-2 duration-200  hover:text-orange-600 hover:bg-orange-50
          
          
          hover:outline-none hover:ring-2 hover:ring-orange-600 hover:border-transparent transition hover:cursor-pointer
            
            
            focus:ring-orange-300 `}
          aria-label="Reset password"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Reset Password
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <Link
            to="/login"
            className="font-medium text-orange-600 hover:underline transition-all"
            aria-label="login a account"
          >
            Back to log in
          </Link>
        </p>
      </div>
    </div>
</main>
  )
}

export default ForgotPassword