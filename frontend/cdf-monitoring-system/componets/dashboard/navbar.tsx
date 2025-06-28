"use client";

import { useEffect, useState } from "react";

export const getUserRole = () => localStorage.getItem("role");
export const getUsername = () => localStorage.getItem("username");

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (!storedUsername || !storedRole) {
      window.location.href = "/login";
      return;
    }

    setUsername(storedUsername);
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-orange-400 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/1200px-Flag_of_Zambia.svg.png"
            className="h-8"
            alt="Zambia Flag"
          />
        </a>

        {/* Mobile Menu Button */}
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 text-sm text-white rounded-lg md:hidden hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <div className="hidden w-full md:flex md:w-auto" id="navbar-dropdown">
          <ul className="flex flex-col md:flex-row items-center md:space-x-4 mt-4 md:mt-0 bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none space-y-2 md:space-y-0">

            {/* Only show "Create Project" if role is marker */}
            {role === "marker" && (
              <li>
                <a
                  href="/projects"
                  className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Create Project
                </a>
              </li>
            )}

            {/* Username & Role */}
            {username && role && (
              <li>
                <button
                  disabled
                  className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md cursor-not-allowed"
                >
                  {username} ({role})
                </button>
              </li>
            )}

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
