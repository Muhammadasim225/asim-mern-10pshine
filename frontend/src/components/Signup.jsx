// SignupScreen.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createAccount } from '../features/authSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
export default function Signup() {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  
  const { loading, error, isAuthenticated, fieldErrors } = useSelector(state => state.createAccount);
  const [form, setForm] = useState({
    full_name: '',
    email_address: '',
    password: '',
    confirm_password: '',
  });

  const [localErrors, setLocalErrors] = useState({});


  useEffect(() => {
    // Create a simple reset action
    dispatch({ type: 'createAccount/resetError' });
  }, [dispatch]);


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Field change hone par related errors clear karo
    if (localErrors[name]) {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Extra protection

    console.log('✅ Form submitted - Page should NOT refresh');
    
    // Sirf password confirmation check karo
    const errors = {};
    
    if (form.password !== form.confirm_password) {
      errors.confirm_password = "Passwords do not match!";
    }
  
    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }
  
    // Clear previous errors
    setLocalErrors({});
    
    dispatch(createAccount({ 
      full_name: form.full_name,
      email_address: form.email_address,
      password: form.password 
    }));
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-3xl shadow-lg p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-orange-600">
            Create Your Account
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Start organizing your thoughts
          </p>
        </div>
      

        {/* Continue with Google Button */}
        <div className='mt-0'>
        <div className="mt-6">
          <button
            onClick={()=>window.open("http://localhost:5000/auth/google","_self")}
            type="button"
            className="w-full hover:cursor-pointer flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>


        <div className="mt-2">
          <button
            onClick={()=>window.open("http://localhost:5000/auth/facebook","_self")}
            type="button"
            className="w-full hover:cursor-pointer flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="#1877F2"
        d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495V14.708H9.692v-3.62h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.62h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"
      />
    </svg>
            Continue with Facebook
          </button>
        </div>
        </div>

        {/* OR Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Existing Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <input
                id="fullName"
                name="full_name"
                type="text"
                required
                value={form.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition focus:z-10 sm:text-sm ${
                  fieldErrors.full_name || localErrors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
                {(fieldErrors.full_name || localErrors.full_name) && (
    <p className="text-red-500 text-xs mt-1">{fieldErrors.full_name || localErrors.full_name}</p>
  )}
            </div>
            <div className="mt-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email_address"
                type="email"
                required
                value={form.email_address}
                onChange={handleChange}
                placeholder="Email address"
                className={`appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition focus:z-10 sm:text-sm ${
                  localErrors.server ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className={`appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition focus:z-10 sm:text-sm  ${
      fieldErrors.password || localErrors.password ? 'border-red-500' : 'border-gray-300'
    }`}
              />
             {(fieldErrors.password || localErrors.password) && (
    <p className="text-red-500 text-xs mt-1">{fieldErrors.password || localErrors.password}</p>
  )}
            </div>

            {error && !fieldErrors.password && !fieldErrors.full_name && !fieldErrors.email_address && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
    {error}
  </div>
)}

            <div className="mt-4">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirm_password"
                type="password"
                required
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:z-10 sm:text-sm *:focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition ${
                  localErrors.confirm_password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
                 {localErrors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{localErrors.confirm_password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-orange-600 focus:ring-offset-2 duration-200  hover:text-orange-600 hover:bg-orange-50 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-600 hover:text-orange-600 hover:bg-orange-50 hover:outline-none hover:ring-2 hover:ring-orange-600 hover:border-transparent'
              }
              hover:outline-none hover:ring-2 hover:ring-orange-600 hover:border-transparent transition hover:cursor-pointer
              `}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}