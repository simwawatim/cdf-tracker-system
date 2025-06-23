"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface CreatedByUser {
  id: number;
  username: string;
  email: string;
  role: string;
  dept: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: "pending" | "active" | "completed" | "delayed";
  startDate: string;
  endDate: string;
  img: string;
  category?: string;
  created_by?: CreatedByUser;
}

const ProjectTable = () => {
  const params = useParams();
  const router = useRouter();

  const categoryId = Number(params.id);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectsByCategory = async (catId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/projects-based-on-category/${catId}/`
      );
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();

      const formattedProjects: Project[] = data.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        progress: project.progress,
        status: project.status,
        startDate: project.start_date,
        endDate: project.end_date,
        img: project.img || "",
        category: project.category?.name || "Uncategorized",
        created_by: {
          id: project.create_by?.id || 0,
          username: project.create_by?.username || "Unknown",
          email: project.create_by?.email || "N/A",
          role: project.create_by?.role || "N/A",
          dept: project.create_by?.dept || "N/A",
        },
      }));

      setProjects(formattedProjects);
    } catch (err) {
      setError((err as Error).message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(categoryId)) {
      fetchProjectsByCategory(categoryId);
    } else {
      setError("Invalid category ID in URL");
    }
  }, [categoryId]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="relative flex flex-col w-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
      <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Projects List
            </h3>
          </div>
        </div>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full mt-4 text-left table-auto min-w-max">
          <thead>
            <tr>
              {[
                "Project",
                "Created By",
                "Role",
                "Progress",
                "Status",
                "Start Date",
                "End Date",
                "Actions",
              ].map((header, i) => (
                <th
                  key={i}
                  className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100"
                >
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    {header}
                    {header && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                      </svg>
                    )}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <tr key={i}>
                  <td className="p-4 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-700">
                      {project.name}
                    </p>
                    {project.category && (
                      <p className="text-xs text-slate-500">
                        {project.category}
                      </p>
                    )}
                  </td>

                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://wenzhixin.github.io/fresh-bootstrap-table/assets/img/new_logo.png`}
                        alt="user pic"
                        className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-700">
                          {project.created_by?.username}
                        </p>
                        <p className="text-sm text-slate-500">
                          {project.created_by?.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-700">
                      {project.created_by?.role}
                    </p>
                  </td>

                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            project.progress < 30
                              ? "bg-red-500"
                              : project.progress < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-slate-700">
                        {project.progress}%
                      </span>
                    </div>
                  </td>

                  <td className="p-4 border-b border-slate-200">
                    <div className="w-max">
                      <div
                        className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${
                          project.status === "completed"
                            ? "bg-green-500/20 text-green-900"
                            : project.status === "active"
                            ? "bg-blue-500/20 text-blue-900"
                            : project.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-900"
                            : "bg-red-500/20 text-red-900"
                        }`}
                      >
                        <span className="capitalize">{project.status}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 border-b border-slate-200">
                    <p className="text-sm text-slate-500">
                      {project.startDate}
                    </p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <p className="text-sm text-slate-500">
                      {project.endDate}
                    </p>
                  </td>

                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/projects-view/${project.id}`}
                        title="View"
                        className="relative h-10 w-10 flex items-center justify-center rounded-lg text-center text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="p-4 text-center text-slate-500 italic"
                >
                  No projects found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3">
        <p className="block text-sm text-slate-500">Page 1 of 10</p>
        <div className="flex gap-1">
          <button
            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85]"
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85]"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;
