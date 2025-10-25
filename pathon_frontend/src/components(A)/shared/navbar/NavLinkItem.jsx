
import React from "react";
import { Link } from "react-router-dom";

const NavLinkItem = ({ to, label, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-lg md:text-base font-medium text-white hover:opacity-90 transition"
    >
      {label}
    </Link>
  );
};

export default NavLinkItem;
