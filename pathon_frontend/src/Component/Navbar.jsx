import React, { useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const [spacerH, setSpacerH] = useState(0);

  // Keep spacer equal to header height (including mobile open/close)
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const update = () => setSpacerH(headerRef.current.getBoundingClientRect().height);
    const ro = new ResizeObserver(update);
    ro.observe(headerRef.current);
    update();
    return () => ro.disconnect();
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/about", label: "About Us" },
    { to: "/blogs", label: "Blogs" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white"
      >
        {/* top bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link to="/" className="text-2xl md:text-xl lg:text-2xl font-bold tracking-tight">
              Pathon
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-lg md:text-base lg:text-lg font-medium hover:opacity-90"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Sign in / Sign up */}
              <div className="flex items-center gap-3 ml-6">
                <Link
                  to="/signin"
                  className="px-4 py-1.5 rounded-md border border-white text-white font-medium hover:bg-white hover:text-blue-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-white text-blue-700 font-semibold hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? (
                // X icon
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // Hamburger
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-[max-height] duration-300 overflow-hidden bg-blue-700 ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-md border border-white text-white font-medium hover:bg-white hover:text-blue-700 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-md bg-white text-blue-700 font-semibold hover:bg-gray-100 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer that matches the header height */}
      <div aria-hidden style={{ height: spacerH }} />
    </>
  );
};

export default Navbar;
