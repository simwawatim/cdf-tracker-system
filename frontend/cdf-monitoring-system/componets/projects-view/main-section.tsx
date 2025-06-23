'use client';

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  DocumentIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getAuthHeaders } from "../../utils/users-auth";

const statusColorMap: { [key: string]: string } = {
  pending: 'text-yellow-600',
  active: 'text-green-600',
  completed: 'text-blue-600',
  on_hold: 'text-red-500',
  in_progress: 'text-blue-500',
};

const iconColorMap: { [key: string]: string } = {
  pending: 'text-yellow-600',
  active: 'text-green-600',
  completed: 'text-blue-600',
  on_hold: 'text-red-500',
  in_progress: 'text-blue-500',
};

const statusIcons: { [key: string]: any } = {
  pending: ExclamationCircleIcon,
  active: PlayCircleIcon,
  completed: CheckCircleIcon,
  on_hold: PauseCircleIcon,
  in_progress: ClockIcon,
};

interface Document {
  id: number;
  file: string;
  uploaded_at: string;
}

interface StatusUpdate {
  updated_by: any;
  id: number;
  status: string;
  action_message: string;
  file_type: string;
  created_at: string;
  documents: Document[];
}

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  progress: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  status_updates: StatusUpdate[];
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500';     
  if (progress >= 50) return 'bg-yellow-500';    
  return 'bg-red-500';                           
};

const statusOptions = ["pending", "active", "completed", "on_hold", "in_progress"];

const ProjectDetail = () => {
  const params = useParams();
  const projectId = params.projectId;
  const [project, setProject] = useState<Project | null>(null);
  const [fileType, setFileType] = useState("application/pdf");

  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [actionMessage, setActionMessage] = useState("");
  const [supportingFiles, setSupportingFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.defaults.baseURL = 'http://127.0.0.1:8000';

    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/v1/projects/${projectId}/`, getAuthHeaders());
        setProject(response.data);
        setNewStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newStatus) {
      setError("Please select a status");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("project", `${projectId}`);
      formData.append("status", newStatus);
      formData.append("file_type", fileType);
      formData.append("action_message", actionMessage || "");

      if (supportingFiles) {
        for (let i = 0; i < supportingFiles.length; i++) {
          formData.append("supporting_files", supportingFiles[i]);
        }
      }

      const response = await axios.post(
        "/api/v1/status-updates/",
        formData,
        {
          ...getAuthHeaders(),
          
        }
      );

      const newUpdate: StatusUpdate = response.data;

      setProject(prev =>
        prev
          ? {
              ...prev,
              status: newUpdate.status,
              status_updates: [...prev.status_updates, newUpdate],
            }
          : prev
      );

      // Reset form
      setModalOpen(false);
      setNewStatus(newUpdate.status);
      setActionMessage("");
      setSupportingFiles(null);
      const fileInput = document.getElementById("supportingDocuments") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error submitting status update:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setError(null);
    setActionMessage("");
    setSupportingFiles(null);
    const fileInput = document.getElementById("supportingDocuments") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading project details...</p>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[project.status] || ClockIcon;

  return (
    <>
      <main className="relative w-full max-w-7xl mx-auto px-4 py-8 text-slate-700 bg-white shadow-lg rounded-xl space-y-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 gap-6">
            {/* Left: Project Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="mt-2 text-gray-600 text-lg max-w-2xl">{project.description}</p>
              
              <span className="inline-block mt-4 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {project.category}
              </span>
            </div>

            {/* Right: User Info */}
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm space-x-4">
              <img 
                src="https://i.pravatar.cc/100?u=timothy" 
                alt="User Avatar" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" 
              />
              <div>
                <h4 className="font-semibold text-gray-900">Timothy Simwawa</h4>
                <p className="text-sm text-gray-600">timothy@gmail.com</p>
                <p className="text-xs text-gray-500">Joined: March 2023</p>
              </div>
            </div>
          </div>


        {/* Project Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <StatusIcon className={`w-6 h-6 mr-3 ${iconColorMap[project.status] || 'text-gray-600'}`} />
              <span className={`font-semibold text-lg capitalize ${statusColorMap[project.status] || 'text-gray-900'}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600">Current project status</p>
          </div>

          {/* Start Date */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <CalendarDaysIcon className="w-6 h-6 text-blue-600 mr-3" />
              <span className="font-semibold text-lg text-gray-900">Start Date</span>
            </div>
            <p className="text-sm text-gray-600">
              {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not set"}
            </p>
          </div>

          {/* End Date */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <DocumentIcon className="w-6 h-6 text-red-600 mr-3" />
              <span className="font-semibold text-lg text-gray-900">End Date</span>
            </div>
            <p className="text-sm text-gray-600">
              {project.end_date ? new Date(project.end_date).toLocaleDateString() : "Not set"}
            </p>
          </div>

          {/* Progress */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h5 className="mb-3 text-lg font-semibold text-gray-900">Progress</h5>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion</span>
              <span className="text-lg font-bold text-gray-900">{project.progress}%</span>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              setNewStatus(project.status);
              setModalOpen(true);
              setError(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
          >
            <ClockIcon className="w-5 h-5" />
            <span>Update Status</span>
          </button>
        </div>

        {/* Status Update Table */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Status Updates History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.status_updates.length > 0 ? (
                  project.status_updates.map((update) => {
                    const UpdateStatusIcon = statusIcons[update.status] || ClockIcon;
                    return (
                      <tr key={update.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {(update.updated_by?.username || "U").charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {update.updated_by?.username || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UpdateStatusIcon className={`w-4 h-4 mr-2 ${iconColorMap[update.status] || 'text-gray-600'}`} />
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              update.status === 'completed' ? 'bg-green-100 text-green-800' :
                              update.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              update.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              update.status === 'on_hold' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {update.status.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {update.action_message || "No message provided"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                            {update.file_type === "application/pdf" ? "PDF" : "Image"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {update.documents.length > 0 ? (
                              update.documents.map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm block hover:underline"
                                >
                                  📄 {doc.file.split("/").pop()}
                                </a>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No files</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(update.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <DocumentIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">No status updates available</p>
                        <p className="text-gray-400 text-sm">Updates will appear here when team members modify the project status</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Project Status</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Selection */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="" disabled>Select status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Message */}
              <div>
                <label htmlFor="actionMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Action Message (optional)
                </label>
                <textarea
                  id="actionMessage"
                  value={actionMessage}
                  onChange={(e) => setActionMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  rows={3}
                  placeholder="Describe the changes or reasons for this status update..."
                  disabled={loading}
                />
              </div>

              {/* File Type Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fileType"
                      value="application/pdf"
                      checked={fileType === "application/pdf"}
                      onChange={() => setFileType("application/pdf")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">PDF Documents</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fileType"
                      value="image/*"
                      checked={fileType === "image/*"}
                      onChange={() => setFileType("image/*")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Images</span>
                  </label>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="supportingDocuments" className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents
                </label>
                <input
                  type="file"
                  id="supportingDocuments"
                  accept={
                    fileType === "application/pdf"
                      ? "application/pdf"
                      : "image/jpeg,image/png,image/jpg"
                  }
                  multiple
                  onChange={(e) => setSupportingFiles(e.target.files)}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  disabled={loading}
                />
                {supportingFiles && supportingFiles.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">Selected files:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {Array.from(supportingFiles).map((file, index) => (
                        <li key={index} className="flex items-center">
                          <DocumentIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Update Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default ProjectDetail;