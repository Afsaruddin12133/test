import React from "react";
import { Link } from "react-router-dom";

const AuthButtons = ({ mobile = false, onClick }) => {
  const base = "px-4 py-2 rounded-md font-medium transition";

  return (
    <div className={`flex ${mobile ? "flex-col gap-2 mt-4" : "gap-3 ml-6"}`}>
      <Link
        to="/signin"
        onClick={onClick}
        className={`${base} border border-white text-white hover:bg-white hover:text-blue-700`}
      >
        Sign In
      </Link>
      <Link
        to="/signup"
        onClick={onClick}
        className={`${base} bg-white text-blue-700 font-semibold hover:bg-gray-100`}
      >
        Sign Up
      </Link>
    </div>
  );
};

export default AuthButtons;
