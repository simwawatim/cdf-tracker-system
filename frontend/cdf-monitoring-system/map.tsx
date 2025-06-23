"use client"; 
import { useEffect, useState } from 'react';
import {getAllProjects} from "../../api/projects/api"


interface Project {
    project: string;
    description: string;
    name: string;
    email: string;
    role: string;
    dept: string;
    progress: number;
    status: 'pending' | 'active' | 'completed' | 'delayed';
    startDate: string;
    endDate: string;
    img: string;
}

const PROJECT_PAGE = 5;

const ProjectTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    project: '',
    description: '',
    name: '',
    email: '',
    role: '',
    dept: '',
    progress: 0,
    status: 'pending',
    startDate: '',
    endDate: '',
    img: 'team-default.jpg'
  });

  const Projects = async () => {
    try {
      const projectData = await getAllProjects();
      const formatedProjects: Project[] = projectData.map((project: any) => ({
        project: project.project,
        description: project.description,
        name: project.name,
        email: project.email,
        role: project.role,
        dept: project.dept,
        progress: project.progress,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        img: project.img,
      }));

      setProjects(formatedProjects);
    } catch(error) {
      console.error("Failed to fetch projects:", error);
    };
  };

  useEffect(() => {
    Projects();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('New project added:', newProject);
    setIsModalOpen(false);
    setNewProject({
      project: '',
      description: '',
      name: '',
      email: '',
      role: '',
      dept: '',
      progress: 0,
      status: 'pending',
      startDate: '',
      endDate: '',
      img: 'team-default.jpg'
    });
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
                {['Project', 'Description', 'Created By', 'Role', 'Progress', 'Status', 'Start Date', 'End Date', 'Actions'].map((header, i) => (
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
                    <p className="text-sm font-semibold text-slate-700">{project.project}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200 max-w-xs">
                    <p className="text-sm text-slate-500 truncate">{project.description}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/${project.img}`}
                        alt={project.name}
                        className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-700">{project.name}</p>
                        <p className="text-sm text-slate-500">{project.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-slate-700">{project.role}</p>
                      <p className="text-sm text-slate-500">{project.dept}</p>
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
                            href={`/projects-view`}
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
                      <button
                        className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20"
                        type="button"
                        title="Edit">
                        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            aria-hidden="true" className="w-4 h-4">
                            <path
                              d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                          </svg>
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

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Project</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type