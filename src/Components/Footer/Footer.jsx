import React from "react";
import { Link } from "react-router";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaRegCopyright,
} from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";
import logo from "../../assets/logo.avif";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "All Issues", path: "/all-issues" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="CityWatch Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">
                City<span style={{ color: "var(--color-primary)" }}>Watch</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Building better communities through transparency and citizen
              engagement. Report issues, track progress, and make a difference.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <HiLocationMarker size={20} className="mt-0.5" />
                <span>Mirpur 1, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <HiPhone size={20} />
                <span>+8801744546898</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <HiMail size={20} />
                <span>contact@citywatch.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get updates on resolved issues and community news.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
              <button
                type="submit"
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-full px-4 py-2 text-white rounded-lg hover:bg-black transition-colors text-sm font-semibold uppercase"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left flex items-center gap-1 justify-center md:justify-start">
              <FaRegCopyright /> {currentYear} CityWatch. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link
                to="/privacy"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
