"use client";

import { useState } from "react";
import Graph from "./graph";
import SideNav from "../side-nav";
import HomeCards from "./home-cards";

const Dashboard = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function handleLogout(): void {
    // Clear user session (e.g., remove tokens from localStorage)
    localStorage.removeItem("authToken");
    // Redirect to login page
    window.location.href = "/login";
  }
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar: 1/3 width */}
        <SideNav>

        </SideNav>
      {/* Main content: 2/3 width */}
      <main className="w-2/3 p-12 overflow-y-auto flex flex-col">
        {/* Top cards grid */}
            <HomeCards>
                
            </HomeCards>

        {/* Chart Section */}
        <section className="bg-dark-500 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark">Monthly Income & Outcome</h2>
          <Graph />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;