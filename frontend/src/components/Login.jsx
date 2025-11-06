import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function LoginScreen() {
  const [form, setForm] = useState({
    email_address: "",
    password: ""
  });
  
  const { loading, isAuthenticated, error, fieldErrors } = useSelector(
    (state) => state.createAccount
  );
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ❌ NO LOCAL VALIDATION - Backend par chhod do
    dispatch(loginAccount(form));
  };

  // Successful login par redirect
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("Login successful, navigating to home...");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="mt-6 text-3xl font-extrabold text-orange-600 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to continue organizing your thoughts.
          </p>
        </div>

        {/* Server Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email_address"
              name="email_address"
              type="email"
              value={form.email_address}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg border bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition ${
                fieldErrors?.email_address ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label="Email address"
            />
            {/* Backend se aaya hua error display karo */}
            {fieldErrors?.email_address && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email_address}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className={`w-full px-4 py-3 rounded-lg border bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition ${
                fieldErrors?.password ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label="Password"
            />
            {/* Backend se aaya hua error display karo */}
            {fieldErrors?.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-600 hover:underline transition-all font-medium"
              aria-label="Forgot password"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex text-lg font-bold items-center justify-center gap-2 px-6 py-3 rounded-lg text-white transform focus:outline-none focus:ring-2 focus:ring-offset-2 duration-200 transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-600 hover:text-orange-600 hover:bg-orange-50 hover:outline-none hover:ring-2 hover:ring-orange-600 hover:border-transparent focus:ring-orange-300'
            }`}
            aria-label="Sign in"
          >
            {loading ? (
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
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-600 hover:underline transition-all"
              aria-label="Sign up for an account"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}