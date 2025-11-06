import React from "react";
export default function Spinner() {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
      </div>
    );
  }
  