"use client"; 

import React, { useEffect, useState } from "react";
import axios from "axios";

type StatusKey = "pending" | "active" | "completed" | "on_hold";

const HomeCards = () => {
  const [statusCounts, setStatusCounts] = useState<Record<StatusKey, number>>({
    pending: 0,
    active: 0,
    completed: 0,
    on_hold: 0,
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/projects/status-count/")
      .then((response) => {
        setStatusCounts(response.data.status_counts);
      })
      .catch((error) => {
        console.error("Error fetching project status counts:", error);
      });
  }, []);

  const cardData: { title: string; statusKey: StatusKey; color: string }[] = [
    { title: "Pending", statusKey: "pending", color: "text-yellow-300" },
    { title: "Active", statusKey: "active", color: "text-green-400" },
    { title: "Completed", statusKey: "completed", color: "text-blue-500" },
    { title: "On Hold", statusKey: "on_hold", color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardData.map((item, index) => (
        <div
          key={index}
          className="bg-orange-400 rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex flex-col"
        >
          <div className={`w-6 h-6 mb-4 ${item.color}`}>
            {/* Example icon or placeholder */}
            <svg fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <h3 className="font-bold text-white mb-2">{item.title} Projects</h3>
          <p className="text-white text-lg">
            {statusCounts[item.statusKey]} Project{statusCounts[item.statusKey] !== 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HomeCards;
