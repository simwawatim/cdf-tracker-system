return (
    <main className="p-6 max-w-7xl mx-auto text-black">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-extrabold">{project.name}</h1>
        <div
          className={`px-4 py-2 rounded-md font-semibold shadow-md whitespace-nowrap ${statusButtonClass(
            project.status
          )}`}
        >
          {project.status.replace("_", " ").toUpperCase()}
        </div>
        <button
          onClick={() => {
            setNewStatus(project.status);
            setModalOpen(true);
            setError(null);
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-md transition"
        >
          Update Status
        </button>
      </header>

      <article className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Description</h2>
        <p className="text-gray-800">{project.description}</p>
      </article>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 font-semibold text-gray-700">
        <div>
          <p className="text-sm uppercase tracking-wide">Category</p>
          <p className="mt-1">{project.category || "Uncategorized"}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide">Start Date</p>
          <p className="mt-1">{project.start_date || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide">End Date</p>
          <p className="mt-1">{project.end_date || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide">Progress</p>
          <p className="mt-1 mb-1">{project.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
            <div
              className={`h-5 rounded-full transition-all duration-500 ${
                project.progress < 30
                  ? "bg-red-600"
                  : project.progress < 70
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </section>

      <footer className="text-gray-600 text-sm flex flex-col md:flex-row md:justify-between gap-2 mb-16">
        <p>
          <strong>Created at:</strong> {new Date(project.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Updated at:</strong> {new Date(project.updated_at).toLocaleString()}
        </p>
      </footer>

      <section className="mb-20">
        <h3 className="text-3xl font-bold mb-6">Project Status History</h3>
        {project.status_updates.length > 0 ? (
          <div className="overflow-x-auto border rounded shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Action</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Documents</th>
                </tr>
              </thead>
              <tbody>
                {project.status_updates.map(({ id, created_at, status, action_message, documents, file_type }) => (
                  <tr key={id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 text-sm whitespace-nowrap">
                      {new Date(created_at).toLocaleString()}
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusButtonClass(status)}`}>
                        {status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{action_message || "-"}</td>
                    <td className="p-3 text-sm space-y-2">
                      {documents.length > 0 ? (
                        documents.map((doc) =>
                          file_type === "image/*" ? (
                            <img
                              key={doc.id}
                              src={`http://127.0.0.1:8000${doc.file}`}
                              alt="supporting"
                              className="w-24 h-auto rounded border"
                            />
                          ) : (
                            <a
                              key={doc.id}
                              href={`http://127.0.0.1:8000${doc.file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 underline"
                            >
                              Download PDF
                            </a>
                          )
                        )
                      ) : (
                        <span className="italic text-gray-400">No documents</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No status updates yet.</p>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-black">
            <h2 className="text-xl font-semibold mb-4">Update Project Status</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-red-600 font-semibold text-center">{error}</p>
              )}
              <div>
                <label htmlFor="status" className="block font-medium mb-1">
                  New Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                  disabled={loading}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="actionMessage" className="block font-medium mb-1">
                  Action Message (optional)
                </label>
                <textarea
                  id="actionMessage"
                  value={actionMessage}
                  onChange={(e) => setActionMessage(e.target.value)}
                  className="w-full border px-3 py-2 rounded resize-y"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">File Type</label>
                <label className="mr-4 cursor-pointer">
                  <input
                    type="radio"
                    name="fileType"
                    value="application/pdf"
                    checked={fileType === "application/pdf"}
                    onChange={() => setFileType("application/pdf")}
                    className="mr-1"
                    disabled={loading}
                  />
                  PDF
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="fileType"
                    value="image/*"
                    checked={fileType === "image/*"}
                    onChange={() => setFileType("image/*")}
                    className="mr-1"
                    disabled={loading}
                  />
                  Image
                </label>
              </div>

              <div>
                <label
                  htmlFor="supportingDocuments"
                  className="block font-medium mb-1 cursor-pointer"
                >
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
                  className="w-full border px-3 py-2 rounded"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );


  export default function UserProfileCard({ user }) {
  return (
    <div className="max-w-sm p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {user.name}
        </h5>
      </a>
      <p className="mb-1 font-normal text-gray-500 dark:text-gray-400">
        {user.email}
      </p>
      <p className="mb-3 text-sm text-gray-400 dark:text-gray-500">
        Joined: March 2023
      </p>
      <a href="#" className="inline-flex font-medium items-center text-blue-600 hover:underline">
        @{user.username}
        <svg
          className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
          />
        </svg>
      </a>
    </div>
  );
}


import { CalendarDaysIcon, ClockIcon, DocumentIcon } from '@heroicons/react/24/outline';

const Cards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1 */}
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-gray-700 mr-2" />
          <h5 className="text-xl font-bold text-gray-900">Pending</h5>
        </div>
        <p className="text-gray-700">Tasks awaiting completion.</p>
      </div>

      {/* Card 2 */}
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <CalendarDaysIcon className="w-6 h-6 text-gray-700 mr-2" />
          <h5 className="text-xl font-bold text-gray-900">Start Date</h5>
        </div>
        <p className="text-gray-700">Scheduled start of the project.</p>
      </div>

      {/* Card 3 */}
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <DocumentIcon className="w-6 h-6 text-gray-700 mr-2" />
          <h5 className="text-xl font-bold text-gray-900">End Date</h5>
        </div>
        <p className="text-gray-700">Expected completion date.</p>
      </div>
    </div>
  );
};

export default Cards;


{project.status_updates.length > 0 ? (
                project.status_updates.map((update) => (
                  <tr key={update.id}>
                    <td className="p-4 border-b border-slate-200">
                      {update.status.charAt(0).toUpperCase() + update.status.slice(1).replace("_", " ")}
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      {update.action_message || "No message"}
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      {update.file_type === "application/pdf" ? "PDF" : "Image"}
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      {update.documents.length > 0 ? (
                        update.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {doc.file.split('/').pop()}
                          </a>
                        ))
                      ) : (
                        "No files"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No status updates available.
                  </td>
                </tr>
              )}

              <main className="w-full max-w-7xl mx-auto px-6 py-10 space-y-10 bg-white text-slate-800">

  {/* SECTION 1: Project Overview */}
  <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Project Info */}
    <div className="bg-slate-50 rounded-xl shadow-sm p-6 space-y-3">
      <div className="flex items-center gap-3">
        <ClipboardIcon className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold">Project Overview</h2>
      </div>
      <h3 className="text-2xl font-semibold">{project.name}</h3>
      <p className="text-gray-500">{project.description}</p>
      <a href="#" className="inline-flex items-center text-blue-600 hover:underline font-medium text-sm">
        CDF Community Project
        <ArrowTopRightOnSquareIcon className="ml-2 w-4 h-4" />
      </a>
    </div>

    {/* Creator Info */}
    <div className="bg-slate-50 rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        <UserIcon className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold">Created By</h2>
      </div>
      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/100?u=timothy"
          alt="User"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-lg">Timothy Simwawa</h4>
          <p className="text-sm text-gray-500">timothy@gmail.com</p>
          <p className="text-xs text-gray-400">Joined: March 2023</p>
          <a href="#" className="text-blue-600 hover:underline text-sm">@tim</a>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 2: Project Status */}
  <section className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <ChartBarIcon className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold">Project Status</h2>
      </div>
      <button
        onClick={() => {
          setNewStatus(project.status);
          setModalOpen(true);
          setError(null);
        }}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-md shadow-sm"
      >
        Update Status
      </button>
    </div>

    {/* Status Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Current Status */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="text-sm text-gray-500 mb-2">Current Status</div>
        <div className={`text-lg font-bold ${statusColorMap[project.status] || 'text-gray-900'}`}>
          {project.status}
        </div>
      </div>

      {/* Start Date */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="text-sm text-gray-500 mb-2">Start Date</div>
        <div className="text-lg font-bold">{project.start_date || 'N/A'}</div>
      </div>

      {/* End Date */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="text-sm text-gray-500 mb-2">End Date</div>
        <div className="text-lg font-bold">{project.end_date || 'N/A'}</div>
      </div>

      {/* Progress */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="text-sm text-gray-500 mb-2">Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${getProgressColor(project.progress)}`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="text-sm font-semibold mt-2 text-center">{project.progress}%</div>
      </div>
    </div>
  </section>

  {/* SECTION 3: Status Updates */}
  <section className="space-y-6">
    <div className="flex items-center gap-3">
      <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-sky-600" />
      <h2 className="text-xl font-bold">Status Updates</h2>
    </div>

    <div className="overflow-x-auto bg-slate-50 rounded-xl shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-white text-slate-500">
          <tr>
            <th className="px-4 py-3">Updated By</th>
            <th className="px-4 py-3">New Status</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3">File Type</th>
            <th className="px-4 py-3">Files</th>
          </tr>
        </thead>
        <tbody>
          {project.status_updates.length > 0 ? (
            project.status_updates.map((update) => (
              <tr key={update.id} className="bg-white border-t">
                <td className="px-4 py-3">{update.updated_by?.username || 'Unknown'}</td>
                <td className="px-4 py-3 capitalize">{update.status.replace("_", " ")}</td>
                <td className="px-4 py-3">{update.action_message || "No message"}</td>
                <td className="px-4 py-3">{update.file_type === "application/pdf" ? "PDF" : "Image"}</td>
                <td className="px-4 py-3 space-y-1">
                  {update.documents.length > 0 ? (
                    update.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        {doc.file.split("/").pop()}
                      </a>
                    ))
                  ) : (
                    "No files"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center px-4 py-6 text-gray-500">
                No status updates yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>

  {/* Modal here if needed */}
  {modalOpen && (
    <YourModalComponent />
  )}
</main>


{/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">Add New Project</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



   <div>
      <h1>Projects in Category #{categoryId}</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj.id}>
                <td>{proj.name}</td>
                <td>{proj.description}</td>
                <td>{proj.progress}%</td>
                <td>{proj.status}</td>
                <td>{proj.startDate}</td>
                <td>{proj.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>