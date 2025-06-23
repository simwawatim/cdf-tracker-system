"use client";

import { useEffect, useState } from "react";
import { getAllProjects, createProject } from "../../api/projects/api";
import { fetchProjectCategoryByName } from "../../api/project-category/api";

interface ProjectCategoryByName {
  id: number;
  name: string;
}

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
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [categories, setCategories] = useState<ProjectCategoryByName[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
  });

 const fetchProjects = async (categoryList: ProjectCategoryByName[]) => {
    try {
      const projectData = await getAllProjects();
      const formattedProjects: Project[] = projectData.map((project: any) => ({
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
      console.log("Formatted Projects:", formattedProjects);
      setProjects(formattedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };
  const fetchCategoriesAndProjects = async () => {
    try {
      const data = await fetchProjectCategoryByName();
      try{
         setCategories(data);
          if (data && data.length > 0) {
            setFormData((prev) => ({ 
              ...prev, 
              category: data[0]?.id?.toString() || "" 
            }));
          }
          await fetchProjects(data);
      }
      catch (error) {
        console.error("Error setting categories:", error);
      }
     
    } catch (error) {
      console.error("Error fetching categories or projects:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndProjects();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});

  if (!formData.category) {
    alert("Please select a category");
    return;
  }

  console.log("Category selected:", formData.category);
  const categoryId = parseInt(formData.category);

  if (isNaN(categoryId)) {
    alert("Invalid category selected");
    return;
  }

  try {
    const payload = {
      id: 0,
      name: formData.name,
      description: formData.description,
      progress: 0,
      start_date: formData.startDate,
      end_date: formData.endDate,
      category: categoryId,
    };

    await createProject(payload);
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      category: categories[0]?.id?.toString() || "",
      startDate: "",
      endDate: "",
    });
    await fetchProjects(categories);
  } catch (error: any) {
    if (error.response?.data) {
      setErrors(error.response.data);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};


  return (
    <>
      <div className="relative flex flex-col w-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Projects List</h3>
            </div>
            <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                type="button">
                Add Project
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                {['Project', 'Created By', 'Role', 'Progress', 'Status', 'Start Date', 'End Date', 'Actions'].map((header, i) => (
                  <th
                    key={i}
                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                      {header}
                      {header && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                          stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                      )}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr key={i}>
                  <td className="p-4 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-700">{project.name}</p>
                    {project.category && (
                      <p className="text-xs text-slate-500">{project.category}</p>
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
                        <p className="text-sm font-semibold text-slate-700">{project.created_by?.username}</p>
                        <p className="text-sm text-slate-500">{project.created_by?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-slate-700">{project.created_by?.role}</p>
                
                    </div>
                  </td>
                  
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            project.progress < 30 ? 'bg-red-500' :
                            project.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} 
                          style={{width: `${project.progress}%`}}>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-700">{project.progress}%</span>
                    </div>
                  </td>
                  
                  <td className="p-4 border-b border-slate-200">
                    <div className="w-max">
                      <div
                        className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${
                          project.status === 'completed' ? 'bg-green-500/20 text-green-900' :
                          project.status === 'active' ? 'bg-blue-500/20 text-blue-900' :
                          project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-900' :
                          'bg-red-500/20 text-red-900'
                        }`}>
                        <span className="capitalize">{project.status}</span>
                      </div>
                    </div>
                  </td>
                   
                  <td className="p-4 border-b border-slate-200">
                    <p className="text-sm text-slate-500">{project.startDate}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <p className="text-sm text-slate-500">{project.endDate}</p>
                  </td>
                   
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20"
                        type="button"
                        title="View">
                        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          <a
                            href={`/projects-view/${project.id}`}
                            title="View"
                            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </a>

                        </span>
                      </button>
                      
                    </div>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between p-3">
          <p className="block text-sm text-slate-500">Page 1 of 10</p>
          <div className="flex gap-1">
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85]"
              type="button">
              Previous
            </button>
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85]"
              type="button">
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.join(", ")}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description.join(", ")}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm">{errors.category.join(", ")}</p>}
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.start_date && <p className="text-red-600 text-sm">{errors.start_date.join(", ")}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date.join(", ")}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      
    </>
  );
};

export default ProjectTable;