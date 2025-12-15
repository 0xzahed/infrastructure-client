import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../assets/logo.avif";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Issues", path: "/all-issues" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-[#FAF6F3] fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[--color-primary] focus:outline-none"
            >
              {isMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          <Link className="flex items-center gap-2" to="/">
            <img
              className="w-10 h-10 md:w-12 md:h-12"
              src={logo}
              alt="CityWatch Logo"
            />
            <span className="site-title text-xl md:text-2xl font-bold">
              City<span style={{ color: "var(--color-primary)" }}>Watch</span>
            </span>
          </Link>

          <div className="hidden lg:flex gap-8">
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center">
            <Link
              to="/login"
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-4 py-2 text-white rounded-md hover:bg-black transition-colors text-sm font-semibold uppercase"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 pt-2">
            <div className="flex flex-col space-y-2">
              {navLinks.map(({ name, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `nav-link px-2 py-2 ${isActive ? "active" : ""}`
                  }
                >
                  {name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
