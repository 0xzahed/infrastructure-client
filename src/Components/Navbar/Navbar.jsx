import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { HiMenu, HiX, HiUser, HiLogout, HiChevronDown } from "react-icons/hi";
import { useAuth } from "../../Context/AuthContext";
import logo from "../../assets/logo.avif";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Issues", path: "/all-issues" },
    { name: "Report Issue", path: "/report-issue" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 hover:border-[var(--color-primary)] transition-colors">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiUser className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <HiChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60] origin-top-right">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.displayName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/my-issues"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <HiUser className="w-5 h-5" />
                      <span>My Issues</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <HiUser className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <HiLogout className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={{ backgroundColor: "var(--color-primary)" }}
                className="px-4 py-2 text-white rounded-md hover:bg-black transition-colors text-sm font-semibold uppercase"
              >
                Login
              </Link>
            )}
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
