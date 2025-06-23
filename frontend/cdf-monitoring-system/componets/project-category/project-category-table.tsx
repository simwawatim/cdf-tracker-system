"use client";

import React, { useEffect, useState } from "react";
import { fetchProjectCategory, createProjectCategory } from "../../api/project-category/api";

interface ProjectCategory {
  id: number;
  name: string;
  description: string;
}

const CATEGORIES_PER_PAGE = 7;

const ProjectCategoryTable = () => {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);

  const loadProjectCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchProjectCategory();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectCategories();

    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    setUsername(storedUsername);
    setRole(storedRole);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const newCategory = await createProjectCategory({
        id: 0,
        name: formData.name,
        description: formData.description,
      });

      setCategories((prev) => [...prev, newCategory]);
      setFormData({ name: "", description: "" });
      setIsOpen(false);
    } catch (err: any) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, startIndex + CATEGORIES_PER_PAGE);

  return (
    <>
      <div className="relative flex flex-col w-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Project Category List</h3>

            {role === "admin" && (
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                onClick={() => {
                  setFormData({ name: "", description: "" });
                  setErrors({});
                  setIsOpen(true);
                }}
              >
                Add Category
              </button>
            )}
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                {["No", "Name", "Description", "Action"].map((header, i) => (
                  <th
                    key={`header-${i}`}
                    className="p-4 transition-colors border-y border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category, index) => (
                  <tr key={`row-${category.id}`}>
                    <td className="p-4 border-b border-slate-200">{startIndex + index + 1}</td>
                    <td className="p-4 border-b border-slate-200">{category.name}</td>
                    <td className="p-4 border-b border-slate-200">{category.description}</td>
                   {role === "admin" && (
                    <td className="p-4 border-b border-slate-200 text-center">
                      <button className="p-2 hover:bg-slate-100 rounded">
                        ✎
                      </button>
                    </td>
                  )}

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3">
          <p className="block text-sm text-slate-500">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-1">
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-xs font-semibold text-slate-600 hover:opacity-75"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-xs font-semibold text-slate-600 hover:opacity-75"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-semibold mb-4">Add Project Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setErrors({});
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCategoryTable;
