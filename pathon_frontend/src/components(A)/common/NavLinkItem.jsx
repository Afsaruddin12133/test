import { NavLink } from "react-router-dom";

const NavLinkItem = ({ name, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `px-4 py-2 font-medium transition-all ${
          isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-500"
        }`
      }
    >
      {name}
    </NavLink>
  );
};

export default NavLinkItem;
