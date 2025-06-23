"use client";
import React, { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../../api/users/users";

interface LocalUser {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  role: string;
  created_at: string;
  updated_at: string;
}

const USERS_PER_PAGE = 7;

const UserTable = () => {
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: ""
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      const mappedUsers: LocalUser[] = data.map((user: any) => ({
        id: user.id,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    setUsername(storedUsername);
    setRole(storedRole);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setFormData({ username: "", email: "", password: "", role: "" });
      setIsOpen(false);
      await loadUsers();
    } catch (err: any) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        console.error("Submission failed:", err);
      }
    }
  };

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

  return (
    <>
      {/* Table and Add Button */}
      <div className="relative flex flex-col w-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Employees List</h3>

            <div className="flex items-center gap-2">
              

              {role === "admin" && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                  onClick={() => setIsOpen(true)}
                >
                  Add member
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                {["Username", "Email", "Role", "Date Joined"].map((header, i) => (
                  <th
                    key={i}
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
                  <td colSpan={4} className="p-4 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="p-4 border-b border-slate-200">{user.user.username}</td>
                    <td className="p-4 border-b border-slate-200">{user.user.email}</td>
                    <td className="p-4 border-b border-slate-200">{user.role}</td>
                    <td className="p-4 border-b border-slate-200">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
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
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.username.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="checker">Checker</option>
                  <option value="marker">Marker</option>
                </select>
                {errors.role && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.role.join(", ")}
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

export default UserTable;
