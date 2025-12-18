import React from "react";
import { Link, Outlet } from "react-router";
import logo from "../assets/logo.avif";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAF6F3] flex flex-col">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CityWatch Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-gray-900">
              City<span style={{ color: "var(--color-primary)" }}>Watch</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <Outlet />
            </div>
            <div className="order-1 lg:order-2 hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop"
                alt="Authentication"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
