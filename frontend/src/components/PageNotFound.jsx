import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white text-slate-700 px-6 py-12 sm:px-8 md:px-12 lg:px-16 font-sans">
      {/* Error Illustration */}
      <div className="text-center max-w-xl w-full space-y-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[80px] sm:text-[100px] md:text-[120px] lg:text-[140px] font-extrabold text-orange-500 leading-none tracking-tight mb-5
          
          
          
          
          ">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Page Not Found
          </h2>
        </div>

        <p className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed max-w-md mx-auto">
          Oops! The page you’re looking for doesn’t exist or may have been
          moved. Let’s get you back to where you belong.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
          <Link
            to="/login"
            className="px-6 sm:px-8 py-3 sm:py-3.5  sm:text-lg  shadow-md  w-full sm:w-auto text-center
            
            
            
             text-lg font-bold items-center justify-center gap-2 rounded-lg text-white  bg-orange-600 transform focus:outline-none focus:ring-2 focus:ring-offset-2 duration-200  hover:text-orange-600 hover:bg-orange-50 hover:outline-none hover:ring-2 hover:ring-orange-600 hover:border-transparent transition hover:cursor-pointer
            focus:ring-orange-300 
            "
          >
            Back to Login
          </Link>

          <Link
            to="/"
            className="px-6 sm:px-8 py-3 sm:py-3.5  sm:text-lg  w-full sm:w-auto text-center
            
            bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50
            "
          >
            Go Home
          </Link>
        </div>

    
      </div>
    </section>
  );
};

export default PageNotFound;
