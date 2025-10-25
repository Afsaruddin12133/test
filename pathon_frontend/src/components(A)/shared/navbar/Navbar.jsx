// src/components/shared/navbar/Navbar.jsx
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import NavLinkItem from "./NavLinkItem";
import AuthButtons from "./AuthButtons";
import { NAV_ITEMS } from "./navItems";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const [spacerHeight, setSpacerHeight] = useState(0);

  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const update = () => setSpacerHeight(headerRef.current.getBoundingClientRect().height);
    const observer = new ResizeObserver(update);
    observer.observe(headerRef.current);
    update();
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Pathon
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLinkItem key={item.to} {...item} />
            ))}
            <AuthButtons />
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-[max-height] duration-300 overflow-hidden bg-blue-700 ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-4">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLinkItem key={item.to} {...item} onClick={closeMenu} />
              ))}
            </nav>
            <AuthButtons mobile onClick={closeMenu} />
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div aria-hidden style={{ height: spacerHeight }} />
    </>
  );
};

export default Navbar;
